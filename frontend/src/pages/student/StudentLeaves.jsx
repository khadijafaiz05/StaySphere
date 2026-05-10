import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function Leaves() {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API}/leaves/student/${studentId}`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setLeaves(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { if (studentId) fetchLeaves(); }, [studentId]);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/leaves`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ student_id: studentId, from_date: fromDate, to_date: toDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply');
      showAlert('Leave request submitted successfully');
      setFromDate(''); setToDate('');
      fetchLeaves();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const diffDays = (from, to) => {
    const d = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
    return d > 0 ? d : 0;
  };

  const pending = leaves.filter(l => l.status === 'Pending').length;
  const approved = leaves.filter(l => l.status === 'Approved').length;

  const statusColor = (s) => {
    if (s === 'Approved') return { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' };
    if (s === 'Rejected') return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
    return { bg: 'rgba(224,154,74,0.15)', color: '#e09a4a' };
  };

  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Leave Requests</h2>
          <p>Apply for and track your leave requests</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Apply form */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px 24px',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>
          Apply for Leave
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>From Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>To Date</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginBottom: '1px' }}>
              Submit Request
            </button>
          </div>
          {fromDate && toDate && (
            <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Duration: <span style={{ color: '#d4a373', fontWeight: 600 }}>{diffDays(fromDate, toDate)} days</span>
            </div>
          )}
        </form>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="label">Total Requests</div>
          <div className="value">{leaves.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Approved</div>
          <div className="value" style={{ color: 'var(--success)' }}>{approved}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: '#e09a4a' }}>{pending}</div>
        </div>
      </div>

      {/* Leave list */}
      {leaves.length === 0 ? (
        <div className="empty">
          <div className="icon">🏖</div>
          <p>No leave requests yet</p>
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-toolbar">
            <h3>My Leave Requests ({leaves.length})</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => {
                const sc = statusColor(l.status);
                return (
                  <tr key={l.leave_id}>
                    <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>#{l.leave_id}</td>
                    <td style={{ fontFamily: 'monospace', color: 'white' }}>{l.from_date?.substring(0, 10)}</td>
                    <td style={{ fontFamily: 'monospace', color: 'white' }}>{l.to_date?.substring(0, 10)}</td>
                    <td style={{ color: '#d4a373', fontWeight: 600 }}>{diffDays(l.from_date, l.to_date)} days</td>
                    <td>
                      <span className="badge" style={{ background: sc.bg, color: sc.color }}>{l.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
