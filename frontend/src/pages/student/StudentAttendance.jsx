import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get(`/attendance/${user.studentId}`).then(r => setLogs(r.data));
  }, [user.studentId]);

  const totalH = logs.reduce((a, l) => a + Number(l.hours_spent || 0), 0);
  const fmt = d => d ? new Date(d).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title"><h2>My Attendance</h2><p>Your entry and exit records</p></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="label">Total Visits</div><div className="value">{logs.length}</div></div>
        <div className="stat-card"><div className="label">Total Hours</div><div className="value">{totalH}</div></div>
        <div className="stat-card"><div className="label">Last Entry</div><div className="value" style={{fontSize:'1.1rem'}}>{logs[0] ? fmtDate(logs[0].entry_time) : '—'}</div></div>
      </div>
      {logs.length === 0
        ? <div className="empty"><div className="icon">📅</div><p>No attendance records yet</p></div>
        : <div className="att-list">
            {logs.map(l => (
              <div key={l.log_id} className="att-item">
                <div className={`att-dot ${!l.exit_time ? 'open' : ''}`}></div>
                <div className="att-info">
                  <div className="att-date">{fmtDate(l.entry_time)}</div>
                  <div className="att-times">In: {fmt(l.entry_time)} {l.exit_time ? `· Out: ${fmt(l.exit_time)}` : '· Still inside'}</div>
                </div>
                {l.exit_time ? <div className="att-hours">{l.hours_spent}h</div> : <span className="badge badge-warn">Active</span>}
              </div>
            ))}
          </div>
      }
    </div>
  );
}