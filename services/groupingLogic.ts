
import { Student, Room } from '../types';
import { CASE_STUDIES, TOTAL_ROOMS_PER_CASE } from '../constants';

export function assignStudentsToRooms(students: Student[]): Room[] {
  // 1. Initialize 12 rooms (2 per case study)
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

  const TARGET_CAPACITY = 4;
  let unassigned = [...students];

  // PASS 1: Assign Rank 1 preference to rooms that have < 4 members
  // We process rooms in a way that balances the two rooms for the same case
  for (let rankIndex = 0; rankIndex < 3; rankIndex++) {
    rooms.forEach(room => {
      if (room.students.length >= TARGET_CAPACITY) return;

      const interested = unassigned.filter(s => s.rankings[rankIndex] === room.caseId);
      const availableSlots = TARGET_CAPACITY - room.students.length;
      const toAssign = interested.slice(0, availableSlots);

      room.students.push(...toAssign);
      const assignedIds = new Set(toAssign.map(s => s.id));
      unassigned = unassigned.filter(s => !assignedIds.has(s.id));
    });
  }

  // PASS 2: Fill remaining slots (under 4) with any leftover students regardless of preference
  rooms.forEach(room => {
    if (room.students.length < TARGET_CAPACITY && unassigned.length > 0) {
      const needed = TARGET_CAPACITY - room.students.length;
      const toAssign = unassigned.slice(0, needed);
      
      room.students.push(...toAssign);
      const assignedIds = new Set(toAssign.map(s => s.id));
      unassigned = unassigned.filter(s => !assignedIds.has(s.id));
    }
  });

  // PASS 3: Overflow Handling
  // If we have 50 students, 48 are now in rooms (12 * 4). 
  // We place the remaining 2 into rooms of their top available preference.
  unassigned.forEach(student => {
    // Find rooms that match student's preferences and have the fewest people (all should have at least 4 now)
    const preferredRoom = rooms
      .filter(r => student.rankings.includes(r.caseId))
      .sort((a, b) => a.students.length - b.students.length)[0] 
      || rooms.sort((a, b) => a.students.length - b.students.length)[0];

    preferredRoom.students.push(student);
  });

  return rooms;
}
