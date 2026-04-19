// Mock data for the application

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@college.edu', role: 'admin', password: 'admin123' },
  { id: 2, name: 'Faculty', email: 'faculty@college.edu', role: 'faculty', password: 'faculty123' },
  { id: 3, name: 'Student', email: 'Student@college.edu', role: 'student', password: 'student123'}
];

export const facultyList = users.filter(u => u.role === 'faculty');

export const officeHours = [
  { id: 1, facultyId: 2, facultyName: 'Faculty', date: '2024-01-25', time: '10:00 AM - 11:00 AM', isBooked: true },
  { id: 2, facultyId: 2, facultyName: 'Faculty', date: '2024-01-26', time: '2:00 PM - 3:00 PM', isBooked: false },
  { id: 3, facultyId: 2, facultyName: 'Faculty', date: '2024-01-27', time: '11:00 AM - 12:00 PM', isBooked: false },
  { id: 4, facultyId: 2, facultyName: 'Faculty', date: '2024-01-28', time: '3:00 PM - 4:00 PM', isBooked: false }
];

export const appointments = [
  { 
    id: 1, 
    studentId: 3, 
    studentName: 'Student', 
    facultyId: 2, 
    facultyName: 'Faculty', 
    officeHourId: 1,
    date: '2024-01-25', 
    time: '10:00 AM - 11:00 AM', 
    doubt: 'Need help understanding React hooks and state management',
    status: 'pending'
  }
];

export const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};
