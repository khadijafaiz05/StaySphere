import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';


//admin pages
import AdminStudents from './pages/admin/AdminStudents';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminVisitors from './pages/admin/AdminVisitors';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminFees from './pages/admin/AdminFees';
import RoomManagement from './pages/admin/RoomManagement';
import RoomAllocations from './pages/admin/RoomAllocations';


//student pages
import StudentProfile from './pages/student/StudentProfile';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentVisitors from './pages/student/StudentVisitors';
import StudentFees from './pages/student/StudentFees';
import Leaves from './pages/student/StudentLeaves';
import Complaints from './pages/student/StudentComplaints';

//login page
import Login from './Login';

const ADMIN_NAV = [
  { key: 'students', icon: '👥', label: 'Students' },
  { key: 'attendance', icon: '📍', label: 'Attendance' },
  { key: 'rooms', icon: '🏠', label: 'Rooms' },
  { key: 'allocations', icon: '🗝', label: 'Room Allocations' },
  { key: 'fees', icon: '💳', label: 'Fee Management' },
  { key: 'visitors', icon: '👤', label: 'Visitors' },
  { key: 'leaves', icon: '🏖', label: 'Leaves' },
  { key: 'complaints', icon: '📋', label: 'Complaints' },
];

const STUDENT_NAV = [
  { key: 'profile', icon: '👤', label: 'My Profile' },
  { key: 'attendance', icon: '📍', label: 'Attendance' },
  { key: 'fees', icon: '💳', label: 'My Fees' },
  { key: 'visitors', icon: '👥', label: 'My Visitors' },
  { key: 'leaves', icon: '🏖', label: 'Leaves' },
  { key: 'complaints', icon: '📋', label: 'Complaints' },
];

function Sidebar({ user, page, onNav, onLogout }) {
  const nav = user.role === 'Admin' ? ADMIN_NAV : STUDENT_NAV;

  return (
    <aside
      style={{
        width: '250px',
        minHeight: '100vh',
        background: '#111827',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '32px' }}>
        <h2
  style={{
    color: '#d4a373',
    fontSize: '1.7rem',
    fontWeight: '700',
    marginBottom: '4px',
    letterSpacing: '0.5px',
    fontFamily: 'Georgia, serif',
  }}
>
  StaySphere
</h2>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.85rem',
          }}
        >
          Hostel Management
        </p>
      </div>

      {/* User Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontWeight: '600',
            marginBottom: '4px',
          }}
        >
          {user.username}
        </div>

        <div
          style={{
            color: '#94a3b8',
            fontSize: '0.85rem',
          }}
        >
          {user.role}
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        {nav.map((item) => {
          const active = page === item.key;

          return (
            <div
              key={item.key}
              onClick={() => onNav(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',

                padding: '13px 16px',

                borderRadius: '14px',

                cursor: 'pointer',

                transition: '0.2s ease',

                background: active
                  ? '#1e293b'
                  : 'transparent',

                color: active
                  ? '#d4a373'
                  : '#cbd5e1',

                fontWeight: active ? '600' : '500',

                fontSize: '0.95rem',
              }}
            >
              <span style={{ fontSize: '1rem' }}>
                {item.icon}
              </span>

              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          marginTop: '24px',

          width: '100%',

          padding: '13px',

          border: '1px solid rgba(255,255,255,0.06)',

          borderRadius: '14px',

          background: '#172036',

          color: '#e5e7eb',

          fontSize: '0.95rem',

          fontWeight: '600',

          cursor: 'pointer',

          transition: '0.2s ease',
        }}
      >
        ↩ Sign Out
      </button>
    </aside>
  );
}

function AdminPage({ page }) {
  if (page === 'students') return <AdminStudents />;
  if (page === 'attendance') return <AdminAttendance />;
  if (page === 'rooms') return <RoomManagement />;
  if (page === 'allocations') return <RoomAllocations />;
  if (page === 'fees') return <AdminFees />;
  if (page === 'visitors') return <AdminVisitors />;
  if (page === 'leaves') return <AdminLeaves />;
  if (page === 'complaints') return <AdminComplaints />;

  return null;
}

function StudentPage({ page }) {
  if (page === 'profile') return <StudentProfile />;
  if (page === 'attendance') return <StudentAttendance />;
  if (page === 'fees') return <StudentFees />;
  if (page === 'visitors') return <StudentVisitors />;
  if (page === 'leaves') return <Leaves />;
  if (page === 'complaints') return <Complaints />;

  return null;
}

function App() {
  const { user, logout } = useAuth();

  const [page, setPage] = useState(
    user?.role === 'Admin' ? 'students' : 'profile'
  );

  useEffect(() => {
    if (user) {
      setPage(user.role === 'Admin' ? 'students' : 'profile');
    }
  }, [user?.role]);

  if (!user) return <Login />;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0b1120',
      }}
    >
      <Sidebar
        user={user}
        page={page}
        onNav={setPage}
        onLogout={logout}
      />

      <main
        style={{
          marginLeft: '250px',
          flex: 1,
          padding: '32px',
        }}
      >
        {user.role === 'Admin' ? (
          <AdminPage page={page} />
        ) : (
          <StudentPage page={page} />
        )}
      </main>
    </div>
  );
}

export default App;