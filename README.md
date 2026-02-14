# Student Doubt Resolution and Faculty Office Hours Booking Platform

A modern, responsive web application for managing student doubts and faculty office hours appointments.

## 🚀 Features

### Student Features
- View available faculty office hours
- Book appointments with faculty
- View appointment status (Pending/Approved/Completed/Cancelled)
- Submit doubt descriptions

### Faculty Features
- Create office hour time slots
- View booked appointments
- Approve or cancel appointments
- View student doubts before meetings

### Admin Features
- View all users
- Add new users (Student/Faculty/Admin)
- Delete users
- Manage system users

## 🛠️ Tech Stack

- **React.js** - Frontend framework with functional components
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
student-doubt-platform/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Side navigation menu
│   │   ├── StatusBadge.jsx      # Status indicator component
│   │   └── AppointmentCard.jsx  # Appointment display card
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── StudentDashboard.jsx # Student dashboard
│   │   ├── BookAppointment.jsx  # Appointment booking page
│   │   ├── FacultyDashboard.jsx # Faculty dashboard
│   │   └── AdminDashboard.jsx   # Admin dashboard
│   ├── layouts/
│   │   └── DashboardLayout.jsx  # Main layout wrapper
│   ├── data/
│   │   └── mockData.js          # Mock data for testing
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd d:\FSD\student-doubt-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will run on `http://localhost:5173`
   - Open this URL in your browser

## 🔐 Demo Credentials

### Student Account
- Email: `student@college.edu`
- Password: `student123`
- Role: Student

### Faculty Account
- Email: `faculty@college.edu`
- Password: `faculty123`
- Role: Faculty

### Admin Account
- Email: `admin@college.edu`
- Password: `admin123`
- Role: Admin

## 📱 Features Implemented

### ✅ Authentication
- Role-based login (Student/Faculty/Admin)
- Simulated authentication with mock data
- Protected routes based on user role

### ✅ Student Portal
- Dashboard with appointment statistics
- View all appointments with status badges
- Book new appointments
- Select faculty and time slots
- Submit doubt descriptions
- Form validation
- Prevent double booking

### ✅ Faculty Portal
- Dashboard with office hours statistics
- Create office hour slots
- View all appointments
- Approve/Cancel appointments
- View student doubts

### ✅ Admin Portal
- User management dashboard
- View all users in table format
- Add new users with validation
- Delete users (except self)
- Role-based user creation

### ✅ UI/UX Features
- Clean, modern, academic design
- Responsive layout (mobile-friendly)
- Color-coded status badges:
  - 🟡 Pending - Yellow
  - 🔵 Approved - Blue
  - 🟢 Completed - Green
  - 🔴 Cancelled - Red
- Loading states
- Success messages
- Form validation
- Error handling

## 🎨 Design Highlights

- Card-based layout
- Sidebar navigation
- Top navbar with user info
- Gradient backgrounds
- Hover effects
- Smooth transitions
- Professional color scheme

## 📝 Notes

- This is a **frontend-only** version with no backend integration
- All data is stored in component state (resets on page refresh)
- Mock data is used for demonstration
- Double booking prevention is implemented on frontend
- Form validation is included for all input forms

## 🚀 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔮 Future Enhancements (Backend Integration)

- Real authentication with JWT
- Database integration
- Email notifications
- Real-time updates
- File uploads
- Chat functionality
- Calendar integration
- Analytics dashboard

## 👨‍💻 Development

This project uses:
- ES6+ JavaScript
- React Hooks (useState)
- Functional Components
- React Router v6
- Tailwind CSS utility classes

## 📞 Support

For any issues or questions, please refer to the project documentation or contact the development team.

---

**Version:** 1.0.0 (Frontend Only)  
**Last Updated:** January 2024
