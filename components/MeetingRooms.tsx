
import React from 'react';
import { Room } from '../types';
import { CASE_STUDIES } from '../constants';

interface Props {
  rooms: Room[];
}

const MeetingRooms: React.FC<Props> = ({ rooms }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-door-open text-emerald-600"></i>
            Assigned Meeting Rooms
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Optimized distribution targeting 4 members per group across 12 rooms.
          </p>
        </div>
        <div className="flex gap-3 text-xs font-bold">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-600">Standard (4)</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Expanded (5)</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => {
          const caseInfo = CASE_STUDIES.find(cs => cs.id === room.caseId);
          const isOverflow = room.students.length > 4;
          
          return (
            <div 
              key={room.id} 
              className={`bg-white rounded-2xl shadow-sm border-t-4 transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden ${
                isOverflow ? 'ring-2 ring-amber-100' : 'border-slate-100'
              }`}
              style={{ borderTopColor: caseInfo?.color }}
            >
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{room.caseName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Group {room.roomNumber}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-black shadow-sm ${
                  isOverflow ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {room.students.length} MEMBERS
                </div>
              </div>
              <div className="p-4">
                {room.students.length > 0 ? (
                  <ul className="space-y-3">
                    {room.students.map((student, idx) => (
                      <li key={student.id} className="flex items-center gap-3 group">
                        <div className="flex-none w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 group-hover:bg-white transition-colors">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{student.name}</p>
                          <p className="text-[9px] text-slate-400">
                             {student.rankings[0] === room.caseId ? '1st Choice' : 'Preference Match'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <i className="fa-solid fa-user-clock text-slate-200 text-2xl mb-2"></i>
                    <p className="text-[10px] text-slate-400 italic">Empty Room</p>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Status</span>
                 <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= room.students.length ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                    ))}
                    {isOverflow && <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingRooms;
