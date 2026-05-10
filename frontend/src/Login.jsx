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
    <div className="login-wrap">
      <div className="login-box fade-in">

        {/*  Brand  */}
        <div className="brand">
          <div className="brand-icon">🏛</div>
          <h1>StaySphere</h1>
          <p>Hostel Management System</p>
        </div>

        {/*  Role toggle  */}
        <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px', marginBottom: '1.4rem', gap: '4px' }}>
          {['Student', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                background: role === r ? 'linear-gradient(135deg, var(--accent), #a87840)' : 'transparent',
                color: role === r ? '#0d0f14' : 'var(--muted)',
                border: 'none',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {r === 'Student' ? '🎓 ' : '🛡 '}{r}
            </button>
          ))}
        </div>

        {/*  Error alert  */}
        {error && <div className="alert alert-error">{error}</div>}

        {/*  Username  */}
        <div className="form-group">
          <label>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={role === 'Admin' ? 'admin1' : 'student1'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/*  Password  */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/*  Submit  */}
        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing in…' : `Sign in as ${role}`}
        </button>

      </div>
    </div>
  );
}
