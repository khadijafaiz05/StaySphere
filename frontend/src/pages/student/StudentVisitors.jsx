import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function StudentVisitors() {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [visitors, setVisitors] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`${API}/visitors/student/${studentId}`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setVisitors(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { if (studentId) fetchVisitors(); }, [studentId]);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fmt = d => d
    ? new Date(d).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const inside = visitors.filter(v => !v.exit_time).length;

  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>My Visitors</h2>
          <p>Track visitors who came to see you</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="label">Total Visitors</div>
          <div className="value">{visitors.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Currently Inside</div>
          <div className="value" style={{ color: inside > 0 ? '#e09a4a' : 'var(--success)' }}>{inside}</div>
        </div>
        <div className="stat-card">
          <div className="label">Exited</div>
          <div className="value">{visitors.length - inside}</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>Visitor Records ({visitors.length})</h3>
          <button className="btn btn-sm btn-ghost" onClick={fetchVisitors}>↻ Refresh</button>
        </div>

        {visitors.length === 0 ? (
          <div className="empty">
            <div className="icon">👥</div>
            <p>No visitor records found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v.visitor_id}>
                  <td style={{ fontWeight: 600, color: 'white' }}>{v.visitor_name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--muted)' }}>{fmt(v.entry_time)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--muted)' }}>{v.exit_time ? fmt(v.exit_time) : '—'}</td>
                  <td>
                    {v.exit_time
                      ? <span className="badge badge-success">Exited</span>
                      : <span className="badge" style={{ background: 'rgba(224,154,74,0.15)', color: '#e09a4a' }}>Inside</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}