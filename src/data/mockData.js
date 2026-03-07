// Mock data for the application

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@college.edu', role: 'admin', password: 'admin123' },
  { id: 2, name: 'Faculty', email: 'faculty@college.edu', role: 'faculty', password: 'faculty123' },
  { id: 3, name: 'Student', email: 'Student@college.edu', role: 'student', password: 'student123'}
];

export const facultyList = users.filter(u => u.role === 'faculty');

export const officeHours = [];

export const appointments = [];

export const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};
