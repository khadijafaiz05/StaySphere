import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAttendance from './pages/admin/AdminAttendance';
import StudentProfile from './pages/student/StudentProfile';
import StudentAttendance from './pages/student/StudentAttendance';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/students" element={
            <ProtectedRoute role="Admin"><Navbar /><AdminStudents /></ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute role="Admin"><Navbar /><AdminAttendance /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="Student"><Navbar /><StudentProfile /></ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute role="Student"><Navbar /><StudentAttendance /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}