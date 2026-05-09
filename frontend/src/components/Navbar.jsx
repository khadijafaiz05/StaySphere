import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminTabs = [
    { label: 'Students', path: '/admin/students' },
    { label: 'Attendance', path: '/admin/attendance' },
  ];
  const studentTabs = [
    { label: 'My Profile', path: '/student/profile' },
    { label: 'Attendance', path: '/student/attendance' },
  ];
  const tabs = user?.role === 'Admin' ? adminTabs : studentTabs;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <span className="brand">🏛 StaySphere</span>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button
            key={t.path}
            className={`nav-tab ${location.pathname === t.path ? 'active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-user">
        <span>{user?.username}</span>
        <span className={`role-badge ${user?.role === 'Admin' ? 'role-admin' : 'role-student'}`}>
          {user?.role}
        </span>
      </div>
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
    </nav>
  );
}