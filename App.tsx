
import React, { useState, useMemo, useEffect } from 'react';
import { Student, Room } from './types';
import { CASE_STUDIES, MAX_STUDENTS } from './constants';
import StudentForm from './components/StudentForm';
import StudentGraph from './components/StudentGraph';
import MeetingRooms from './components/MeetingRooms';
import FileImporter from './components/FileImporter';
import { assignStudentsToRooms } from './services/groupingLogic';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'rooms'>('input');

  const addStudent = (student: Student) => {
    if (students.length >= MAX_STUDENTS) {
      alert("Maximum student limit reached!");
      return;
    }
    setStudents(prev => [...prev, student]);
  };

  const addMultipleStudents = (newStudents: Student[]) => {
    const remainingSpace = MAX_STUDENTS - students.length;
    if (remainingSpace <= 0) {
      alert("Registry is already full.");
      return;
    }
    
    const toAdd = newStudents.slice(0, remainingSpace);
    setStudents(prev => [...prev, ...toAdd]);
    
    if (newStudents.length > remainingSpace) {
      alert(`Only added ${remainingSpace} students. Maximum capacity (50) reached.`);
    } else {
      alert(`Successfully imported ${toAdd.length} students.`);
    }
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setStudents([]);
      setRooms([]);
    }
  };

  const generateGroups = () => {
    if (students.length === 0) {
      alert("Please add some students first.");
      return;
    }
    const assignedRooms = assignStudentsToRooms(students);
    setRooms(assignedRooms);
    setActiveTab('rooms');
  };

  // Populate exactly 50 students with diverse rankings
  const populateDemo = () => {
    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    const demoStudents: Student[] = [];
    
    // Generate 50 unique-ish names
    for (let i = 0; i < 50; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Ensure we don't pick the same case twice for a single student
      const shuffledCases = [...CASE_STUDIES].sort(() => 0.5 - Math.random());
      
      demoStudents.push({
        id: crypto.randomUUID(),
        name: `${fn} ${ln} #${i + 1}`,
        rankings: [
          shuffledCases[0].id,
          shuffledCases[1].id,
          shuffledCases[2].id,
        ]
      });
    }
    
    setStudents(demoStudents);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 px-8 sticky top-0 z-50 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">University Group Planner</h1>
              <p className="text-slate-400 text-xs">Professor Management Dashboard</p>
            </div>
          </div>

          <nav className="flex bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('input')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'input' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Registry & Visualization
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'rooms' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Meeting Rooms
            </button>
          </nav>

          <div className="flex gap-2">
            <button 
              onClick={generateGroups}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Optimize Groups
            </button>
            <button 
              onClick={clearAll}
              className="bg-slate-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              title="Clear all"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form and List */}
            <div className="lg:col-span-5 space-y-8">
              <StudentForm onAddStudent={addStudent} studentCount={students.length} />
              
              <div className="grid grid-cols-1 gap-8">
                 <FileImporter onDataLoaded={addMultipleStudents} />

                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <i className="fa-solid fa-list-ul text-blue-500"></i>
                      Student Registry
                    </h3>
                    <button 
                      onClick={populateDemo} 
                      className="text-[10px] text-blue-600 hover:underline font-bold bg-blue-50 px-2 py-1 rounded"
                    >
                      Load Full Class (50)
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {students.length === 0 ? (
                      <div className="p-8 text-center">
                        <i className="fa-solid fa-users-slash text-slate-200 text-4xl mb-3"></i>
                        <p className="text-slate-400 text-sm font-medium">No students added yet.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Top Choice</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-700">{s.name}</td>
                              <td className="px-4 py-3">
                                <span 
                                  className="px-2 py-0.5 rounded text-[10px] text-white font-bold"
                                  style={{ backgroundColor: CASE_STUDIES.find(c => c.id === s.rankings[0])?.color }}
                                >
                                  {CASE_STUDIES.find(c => c.id === s.rankings[0])?.name.split(':')[0]}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button 
                                  onClick={() => removeStudent(s.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                >
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visualization */}
            <div className="lg:col-span-7">
              <StudentGraph students={students} />
              
              <div className="mt-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-book-open"></i>
                  Case Study Briefing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CASE_STUDIES.map(cs => (
                    <div key={cs.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2 group hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: cs.color }}></div>
                        <span className="text-xs font-bold text-slate-800">{cs.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        "{cs.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {rooms.length > 0 ? (
              <MeetingRooms rooms={rooms} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-solid fa-puzzle-piece text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Assignments Yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm text-center">
                  Click "Optimize Groups" to automatically assign students to their preferred meeting rooms.
                </p>
                <button 
                  onClick={generateGroups}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md active:scale-95"
                >
                  Generate Now
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Status Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700/50 flex items-center gap-8 text-sm z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-semibold">{students.length}</span> Students Registered
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{rooms.length}</span> Active Rooms
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <div className="text-slate-400 italic text-[10px] uppercase font-bold tracking-widest">
          Limit: {MAX_STUDENTS}
        </div>
      </div>
    </div>
  );
};

export default App;
