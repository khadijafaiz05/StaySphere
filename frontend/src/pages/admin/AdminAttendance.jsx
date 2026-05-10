import { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function AdminAttendance() {
  const [logs,      setLogs]      = useState([]);
  const [studentId, setStudentId] = useState('');
  const [alert,     setAlert]     = useState(null);

  const load = async () => {
    try {
      const res  = await fetch(`${API}/attendance`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load logs');
      setLogs(data);
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCheckin = async () => {
    if (!studentId) { showAlert('Enter a student ID', 'error'); return; }
    try {
      const res  = await fetch(`${API}/attendance/checkin`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify({ student_id: parseInt(studentId) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check-in failed');
      showAlert('Check-in recorded');
      setStudentId('');
      load();
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const handleCheckout = async (logId) => {
    try {
      const res  = await fetch(`${API}/attendance/checkout/${logId}`, {
        method:  'PUT',
        headers: authHeader()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check-out failed');
      showAlert('Check-out recorded');
      load();
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  const openLogs  = logs.filter((l) => !l.exit_time);
  const closedLogs = logs.filter((l) => l.exit_time);

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Attendance Tracking</h2>
          <p>Record and monitor student check-ins and check-outs</p>
        </div>
      </div>

      {/*  Alert banners  */}
      {alert && (
        <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {alert.msg}
        </div>
      )}

      {/*  Summary stats  */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Logs</div>
          <div className="value">{logs.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Currently Inside</div>
          <div className="value" style={{ color: 'var(--success)' }}>{openLogs.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Checked Out</div>
          <div className="value" style={{ color: 'var(--muted)' }}>{closedLogs.length}</div>
        </div>
      </div>

      {/* ── Check-in form ── */}
      <div className="checkin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Record Check-In</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.8rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Student ID</label>
            <input
              type="number"
              placeholder="Enter student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ marginBottom: '1.2rem' }}
            onClick={handleCheckin}
          >
            Check In
          </button>
        </div>
      </div>

      {/*  Currently inside  */}
      {openLogs.length > 0 && (
        <div className="table-wrap" style={{ marginBottom: '1.5rem' }}>
          <div className="table-toolbar">
            <h3>Currently Inside</h3>
            <span className="badge badge-success">{openLogs.length} active</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Entry Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {openLogs.map((log) => (
                <tr key={log.log_id}>
                  <td style={{ fontWeight: 500 }}>{log.name}</td>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                    {fmt(log.entry_time)}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCheckout(log.log_id)}
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/*  All logs table  */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Attendance Logs</h3>
          <button className="btn btn-sm btn-ghost" onClick={load}>↻ Refresh</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.log_id}>
                <td style={{ fontWeight: 500 }}>{log.name}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                  {fmt(log.entry_time)}
                </td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                  {log.exit_time ? fmt(log.exit_time) : '—'}
                </td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>
                  {log.exit_time ? `${log.hours_spent}h` : '—'}
                </td>
                <td>
                  <span className={`badge ${log.exit_time ? 'badge-success' : 'badge-warn'}`}>
                    {log.exit_time ? 'Done' : 'Inside'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="empty">
            <div className="icon">🕐</div>
            <p>No attendance logs yet</p>
          </div>
        )}
      </div>
    </div>
  );
}