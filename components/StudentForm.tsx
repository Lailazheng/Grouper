
import React, { useState } from 'react';
import { CaseStudy, Student } from '../types';
import { CASE_STUDIES } from '../constants';

interface Props {
  onAddStudent: (student: Student) => void;
  studentCount: number;
}

const StudentForm: React.FC<Props> = ({ onAddStudent, studentCount }) => {
  const [name, setName] = useState('');
  const [rankings, setRankings] = useState<string[]>(['', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rankings.some(r => r === '')) return;

    onAddStudent({
      id: crypto.randomUUID(),
      name: name.trim(),
      rankings: [...rankings],
    });

    setName('');
    setRankings(['', '', '']);
  };

  const updateRanking = (index: number, value: string) => {
    const newRankings = [...rankings];
    newRankings[index] = value;
    setRankings(newRankings);
  };

  const isComplete = name.trim() !== '' && !rankings.includes('');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-user-plus text-blue-600"></i>
        Add Student ({studentCount}/50)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Student Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter name..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((rank, idx) => (
            <div key={rank}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preference {rank}</label>
              <select
                value={rankings[idx]}
                onChange={(e) => updateRanking(idx, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Case...</option>
                {CASE_STUDIES.map((cs) => (
                  <option 
                    key={cs.id} 
                    value={cs.id}
                    disabled={rankings.includes(cs.id) && rankings[idx] !== cs.id}
                  >
                    {cs.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isComplete}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
            isComplete 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Add to Registry
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
