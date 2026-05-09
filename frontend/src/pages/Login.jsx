import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter credentials'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', { username, password });
      login({ username: data.username, role: data.role, studentId: data.studentId }, data.token);
      navigate(data.role === 'Admin' ? '/admin/students' : '/student/profile');
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="brand">
          <div className="brand-icon">🏛</div>
          <h1>StaySphere</h1>
          <p>Smart Hostel Management System</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            placeholder="Enter username" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="demo-hint">Demo: admin1 / pass · student1 / pass</p>
      </div>
    </div>
  );
}
