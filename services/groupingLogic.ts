
import { Student, Room, CaseStudy } from '../types';
import { CASE_STUDIES, TOTAL_ROOMS_PER_CASE } from '../constants';

export function assignStudentsToRooms(students: Student[]): Room[] {
  // Initialize rooms
  const rooms: Room[] = [];
  CASE_STUDIES.forEach((cs) => {
    for (let i = 1; i <= TOTAL_ROOMS_PER_CASE; i++) {
      rooms.push({
        id: `${cs.id}-room-${i}`,
        caseId: cs.id,
        caseName: cs.name,
        roomNumber: i,
        students: [],
      });
    }
  });

  // Calculate capacity
  const targetCapacity = Math.ceil(students.length / rooms.length);

  // Deep copy students to track unassigned ones
  let unassigned = [...students];

  // Pass 1: Assign to first preference if room is not full
  rooms.forEach(room => {
    const prefersThis = unassigned.filter(s => s.rankings[0] === room.caseId);
    // Take a portion for this room (since there are 2 rooms per case)
    const toAssign = prefersThis.slice(0, targetCapacity);
    room.students.push(...toAssign);
    unassigned = unassigned.filter(s => !toAssign.find(a => a.id === s.id));
  });

  // Pass 2: Assign to second/third preference if room is not full
  rooms.forEach(room => {
    if (room.students.length >= targetCapacity) return;
    
    const availableSlots = targetCapacity - room.students.length;
    const prefersThis = unassigned.filter(s => s.rankings.includes(room.caseId));
    const toAssign = prefersThis.slice(0, availableSlots);
    
    room.students.push(...toAssign);
    unassigned = unassigned.filter(s => !toAssign.find(a => a.id === s.id));
  });

  // Pass 3: Randomly distribute remaining unassigned students
  unassigned.forEach(student => {
    // Find room with minimum students
    const leastFullRoom = rooms.reduce((prev, curr) => 
      curr.students.length < prev.students.length ? curr : prev
    );
    leastFullRoom.students.push(student);
  });

  return rooms;
}
