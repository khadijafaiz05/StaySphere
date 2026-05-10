import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function StudentAttendance() {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [logs,  setLogs]  = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchLogs = async () => {
    try {
      const res  = await fetch(`${API}/attendance/${studentId}`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load logs');
      setLogs(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { if (studentId) fetchLogs(); }, [studentId]);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const hoursSpent = (entry, exit) => {
    if (!entry || !exit) return '—';
    const diff = (new Date(exit) - new Date(entry)) / (1000 * 60 * 60);
    return `${diff.toFixed(1)}h`;
  };

  const totalLogs    = logs.length;
  const insideLogs   = logs.filter(l => !l.exit_time).length;
  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>My Attendance</h2>
          <p>Your hostel entry and exit history</p>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={fetchLogs}>↻ Refresh</button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {alert.msg}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Visits</div>
          <div className="value">{totalLogs}</div>
        </div>
        <div className="stat-card">
          <div className="label">Currently Inside</div>
          <div className="value" style={{ color: insideLogs > 0 ? 'var(--warn)' : 'var(--success)' }}>
            {insideLogs > 0 ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>Attendance Logs ({totalLogs})</h3>
        </div>

        {logs.length === 0 ? (
          <div className="empty">
            <div className="icon">🕐</div>
            <p>No attendance records found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.log_id}>
                  <td style={{ fontFamily: "'DM Mono', monospace", color: 'var(--muted)', fontSize: '0.82rem' }}>
                    #{log.log_id}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {fmt(log.entry_time)}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {log.exit_time ? fmt(log.exit_time) : '—'}
                  </td>
                  <td style={{ fontFamily: "'DM Mono', monospace", color: '#d4a373', fontWeight: 600 }}>
                    {hoursSpent(log.entry_time, log.exit_time)}
                  </td>
                  <td>
                    <span className={`badge ${log.exit_time ? 'badge-success' : 'badge-warn'}`}>
                      {log.exit_time ? 'Exited' : 'Inside'}
                    </span>
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
