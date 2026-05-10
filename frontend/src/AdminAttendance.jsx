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

  const openLogs = logs.filter((l) => !l.exit_time);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Attendance Tracking</h2>

      {alert && (
        <p style={{ color: alert.type === 'error' ? 'red' : 'green' }}>
          {alert.msg}
        </p>
      )}

      <h3>Total Logs: {logs.length}</h3>
      <h3>Currently Inside: {openLogs.length}</h3>

      <br />

      <div>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <br /><br />
        <button onClick={handleCheckin}>Check In</button>
      </div>

      <br /><br />

      {openLogs.length > 0 && (
        <div>
          <h3>Students Currently Inside</h3>
          {openLogs.map((log) => (
            <div key={log.log_id} style={{ marginBottom: '10px' }}>
              <span>{log.name} (#{log.log_id})</span>
              {' '}
              <button onClick={() => handleCheckout(log.log_id)}>Check Out</button>
            </div>
          ))}
        </div>
      )}

      <br /><br />

      <h3>All Attendance Logs</h3>

      <table border="1" cellPadding="10" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
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
              <td>{log.name}</td>
              <td>{fmt(log.entry_time)}</td>
              <td>{log.exit_time ? fmt(log.exit_time) : '—'}</td>
              <td>{log.exit_time ? `${log.hours_spent}h` : '—'}</td>
              <td>{log.exit_time ? 'Done' : 'Inside'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}