import { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AdminAttendance() {
  const [logs, setLogs] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [alert, setAlert] = useState(null);

  const load = async () => {
    const { data } = await API.get('/attendance');
    setLogs(data);
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCheckin = async () => {
    if (!studentId) { showAlert('Enter a student ID', 'error'); return; }
    try {
      await API.post('/attendance/checkin', { student_id: studentId });
      showAlert('Check-in recorded'); setStudentId(''); load();
    } catch (e) { showAlert(e.response?.data?.error || 'Error', 'error'); }
  };

  const handleCheckout = async (logId) => {
    try {
      await API.put(`/attendance/checkout/${logId}`);
      showAlert('Check-out recorded'); load();
    } catch (e) { showAlert(e.response?.data?.error || 'Error', 'error'); }
  };

  const fmt = d => d ? new Date(d).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
  const open = logs.filter(l => !l.exit_time);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title"><h2>Attendance Tracking</h2><p>Monitor hostel entry/exit logs</p></div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="stats-grid">
        <div className="stat-card"><div className="label">Total Logs</div><div className="value">{logs.length}</div></div>
        <div className="stat-card"><div className="label">Currently Inside</div><div className="value" style={{color:'var(--warn)'}}>{open.length}</div></div>
      </div>

      <div className="checkin-card">
        <h3>Record Attendance</h3>
        <div className="checkin-row">
          <div className="form-group" style={{margin:0,flex:1}}>
            <label>Student ID</label>
            <input type="number" placeholder="e.g. 1" value={studentId} onChange={e => setStudentId(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={handleCheckin}>✓ Check In</button>
        </div>
        {open.length > 0 && (
          <div style={{marginTop:'1rem'}}>
            <div style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:'0.6rem',fontWeight:600,textTransform:'uppercase'}}>Open — Click to Check Out</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
              {open.map(l => (
                <button key={l.log_id} className="btn btn-sm btn-warn" onClick={() => handleCheckout(l.log_id)}
                  style={{background:'rgba(224,154,74,0.15)',color:'var(--warn)',border:'1px solid rgba(224,154,74,0.3)'}}>
                  {l.name} #{l.log_id} →
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="table-wrap">
        <div className="table-toolbar"><h3>All Logs ({logs.length})</h3></div>
        <table>
          <thead><tr><th>Student</th><th>Entry</th><th>Exit</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.log_id}>
                <td style={{fontWeight:600}}>{l.name}</td>
                <td style={{fontFamily:'monospace'}}>{fmt(l.entry_time)}</td>
                <td style={{fontFamily:'monospace'}}>{l.exit_time ? fmt(l.exit_time) : '—'}</td>
                <td>{l.exit_time ? `${l.hours_spent}h` : '—'}</td>
                <td>{l.exit_time ? <span className="badge badge-success">Done</span> : <span className="badge badge-warn">Inside</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}