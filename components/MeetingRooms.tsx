
import React from 'react';
import { Room } from '../types';
import { CASE_STUDIES } from '../constants';

interface Props {
  rooms: Room[];
}

const MeetingRooms: React.FC<Props> = ({ rooms }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-door-open text-emerald-600"></i>
          Assigned Meeting Rooms
        </h2>
        <div className="flex gap-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Room 1
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Room 2
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const caseInfo = CASE_STUDIES.find(cs => cs.id === room.caseId);
          return (
            <div 
              key={room.id} 
              className="bg-white rounded-xl shadow-md border-l-4 overflow-hidden transform transition-all hover:scale-[1.02]"
              style={{ borderLeftColor: caseInfo?.color }}
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{room.caseName}</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    Room #{room.roomNumber}
                  </p>
                </div>
                <span className="bg-white px-2 py-1 rounded text-xs font-bold shadow-sm border border-slate-200">
                  {room.students.length} Students
                </span>
              </div>
              <div className="p-4">
                {room.students.length > 0 ? (
                  <ul className="space-y-2">
                    {room.students.map((student) => (
                      <li key={student.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {student.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2">No students assigned yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingRooms;
