import { useState } from 'react';
import { useAuth } from './context/AuthContext';

const API = 'http://localhost:3000/api';

export default function Login() {
  const [role,     setRole]     = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter your credentials'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password, loginAs: role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login({ username: data.username, role: data.role, studentId: data.studentId }, data.token);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f1117'
    }}>
      <div style={{
        background: '#161a24',
        border: '1px solid #2a3045',
        borderRadius: '14px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '380px'
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏛</div>
          <h1 style={{ color: '#eef0f8', fontSize: '26px', fontWeight: 700, margin: 0 }}>
            StaySphere
          </h1>
          <p style={{ color: '#6b7899', fontSize: '13px', marginTop: '4px' }}>
            Hostel Management System
          </p>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex',
          background: '#1c2133',
          border: '1px solid #2a3045',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          {['Student', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                background: role === r ? '#4a90d9' : 'transparent',
                color: role === r ? '#fff' : '#6b7899',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {r === 'Student' ? '🎓 ' : '🛡 '}{r}
            </button>
          ))}
        </div>

        {error && (
          <p style={{
            background: 'rgba(224,92,106,0.15)',
            border: '1px solid #e05c6a',
            color: '#e05c6a',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            marginBottom: '14px'
          }}>
            {error}
          </p>
        )}

        {/* Username */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7899', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Username
          </label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={role === 'Admin' ? 'admin1' : 'student1'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#1c2133',
              border: '1px solid #2a3045',
              borderRadius: '6px',
              color: '#eef0f8',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7899', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#1c2133',
              border: '1px solid #2a3045',
              borderRadius: '6px',
              color: '#eef0f8',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            background: '#4a90d9',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontFamily: 'inherit'
          }}
        >
          {loading ? 'Signing in...' : `Sign in as ${role}`}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6b7899' }}>
          Demo: {role === 'Admin' ? 'admin1 / pass' : 'student1 / pass'}
        </p>
      </div>
    </div>
  );
}