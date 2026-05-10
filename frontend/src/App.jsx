import { useState } from 'react';
import { useAuth } from './context/AuthContext';

// Admin pages
import AdminStudents    from './AdminStudents';
import AdminAttendance  from './AdminAttendance';
import AdminVisitors    from './AdminVisitors';
import AdminLeaves      from './AdminLeaves';
import AdminComplaints  from './Admincomplaints';
import AdminFees        from './AdminFees';
import RoomManagement   from './RoomManagement';
import RoomAllocations  from './RoomAllocations';

// Student pages
import StudentProfile    from './StudentProfile';
import StudentAttendance from './StudentAttendance';
import StudentVisitors   from './StudentVisitors';
import StudentFees       from './StudentFees';
import Leaves            from './Leaves';
import Complaints        from './Complaints';

import Login from './Login';

const ADMIN_NAV = [
  { key: 'students',    icon: '👥', label: 'Students' },
  { key: 'attendance',  icon: '📍', label: 'Attendance' },
  { key: 'rooms',       icon: '🏠', label: 'Rooms' },
  { key: 'allocations', icon: '🗝', label: 'Room Allocations' },
  { key: 'fees',        icon: '💳', label: 'Fee Management' },
  { key: 'visitors',    icon: '👤', label: 'Visitors' },
  { key: 'leaves',      icon: '🏖', label: 'Leaves' },
  { key: 'complaints',  icon: '📋', label: 'Complaints' },
];

const STUDENT_NAV = [
  { key: 'profile',    icon: '👤', label: 'My Profile' },
  { key: 'attendance', icon: '📍', label: 'Attendance' },
  { key: 'fees',       icon: '💳', label: 'My Fees' },
  { key: 'visitors',   icon: '👥', label: 'My Visitors' },
  { key: 'leaves',     icon: '🏖', label: 'Leaves' },
  { key: 'complaints', icon: '📋', label: 'Complaints' },
];

function Sidebar({ user, page, onNav, onLogout }) {
  const nav = user.role === 'Admin' ? ADMIN_NAV : STUDENT_NAV;

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: '#161a24',
      borderRight: '1px solid #2a3045',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid #2a3045' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#eef0f8' }}>StaySphere</div>
        <div style={{ fontSize: '11px', color: '#6b7899', marginTop: '2px' }}>Hostel Management</div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #2a3045' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#eef0f8' }}>{user.username}</div>
        <div style={{ fontSize: '11px', color: '#6b7899' }}>{user.role}</div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, paddingTop: '8px' }}>
        {nav.map(item => (
          <div
            key={item.key}
            onClick={() => onNav(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 20px',
              cursor: 'pointer',
              fontSize: '13px',
              color: page === item.key ? '#4a90d9' : '#c8cfe0',
              background: page === item.key ? 'rgba(74,144,217,0.15)' : 'transparent',
              borderLeft: `3px solid ${page === item.key ? '#4a90d9' : 'transparent'}`,
              fontWeight: page === item.key ? 600 : 400
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #2a3045' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: '#1c2133',
            border: '1px solid #2a3045',
            borderRadius: '6px',
            color: '#c8cfe0',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  );
}

function AdminPage({ page }) {
  if (page === 'students')    return <AdminStudents />;
  if (page === 'attendance')  return <AdminAttendance />;
  if (page === 'rooms')       return <RoomManagement />;
  if (page === 'allocations') return <RoomAllocations />;
  if (page === 'fees')        return <AdminFees />;
  if (page === 'visitors')    return <AdminVisitors />;
  if (page === 'leaves')      return <AdminLeaves />;
  if (page === 'complaints')  return <AdminComplaints />;
  return null;
}

function StudentPage({ page }) {
  if (page === 'profile')    return <StudentProfile />;
  if (page === 'attendance') return <StudentAttendance />;
  if (page === 'fees')       return <StudentFees />;
  if (page === 'visitors')   return <StudentVisitors />;
  if (page === 'leaves')     return <Leaves />;
  if (page === 'complaints') return <Complaints />;
  return null;
}

function App() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(
    user?.role === 'Admin' ? 'students' : 'profile'
  );

  if (!user) return <Login />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>
      <Sidebar
        user={user}
        page={page}
        onNav={setPage}
        onLogout={logout}
      />
      <main style={{ marginLeft: '220px', flex: 1, padding: '28px 32px' }}>
        {user.role === 'Admin'
          ? <AdminPage   page={page} />
          : <StudentPage page={page} />
        }
      </main>
    </div>
  );
}

export default App;