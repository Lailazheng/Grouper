
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
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
        <i className="fa-solid fa-user-plus text-blue-600"></i>
        Add Student ({studentCount}/50)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Case Preferences</label>
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((rank, idx) => (
              <div key={rank} className="relative group">
                <div className="flex gap-2">
                   <div className="flex-none w-8 h-10 flex items-center justify-center bg-slate-100 rounded-lg text-xs font-bold text-slate-500 border border-slate-200">
                     #{rank}
                   </div>
                   <div className="flex-1">
                      <select
                        value={rankings[idx]}
                        onChange={(e) => updateRanking(idx, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-sm"
                      >
                        <option value="">Choose your {rank === 1 ? 'top' : rank === 2 ? 'second' : 'third'} choice...</option>
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
                </div>
                {rankings[idx] && (
                  <div className="mt-1 ml-10 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 italic">
                    <i className="fa-solid fa-circle-info text-blue-400 mr-1"></i>
                    {CASE_STUDIES.find(c => c.id === rankings[idx])?.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isComplete}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
            isComplete 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Add to Registry
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
