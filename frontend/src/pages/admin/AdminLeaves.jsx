import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [error,  setError]  = useState('');

  
  const fetchLeaves = async () => {
    try {
      const res  = await fetch(`${API}/leaves`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load leaves');
      setLeaves(data);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { fetchLeaves(); }, []);


  const updateStatus = async (id, status) => {
    try {
      const res  = await fetch(`${API}/leaves/${id}/status`, {
        method: 'PATCH', headers: authHeader(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      fetchLeaves();
    } catch (e) { alert(e.message); }
  };


  const pending  = leaves.filter(l => l.status === 'Pending');
  const approved = leaves.filter(l => l.status === 'Approved');
  const rejected = leaves.filter(l => l.status === 'Rejected');

  const fmt = d => d?.substring(0, 10) ?? '—';

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Leave Requests</h2>
          <p>Review and respond to student leave applications</p>
        </div>
      </div>

      {/*  Error alert  */}
      {error && <div className="alert alert-error">{error}</div>}

      {/*  Summary stats  */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total</div>
          <div className="value">{leaves.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{pending.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Approved</div>
          <div className="value" style={{ color: 'var(--success)' }}>{approved.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Rejected</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{rejected.length}</div>
        </div>
      </div>

      {/*  Leave request cards  */}
      <div className="att-list">
        {leaves.map(leave => (
          <div key={leave.leave_id} className="att-item" style={{ flexWrap: 'wrap', gap: '1rem' }}>

            {/* Status dot indicator */}
            <div className="att-dot"
              style={{
                background: leave.status === 'Approved' ? 'var(--success)'
                           : leave.status === 'Rejected' ? 'var(--danger)'
                           : 'var(--warn)'
              }}
            />

            {/* Leave details */}
            <div className="att-info" style={{ minWidth: 160 }}>
              <div className="att-date">{leave.student_name}</div>
              <div className="att-times">
                {fmt(leave.from_date)} → {fmt(leave.to_date)}
              </div>
            </div>

            {/* Status badge */}
            <span className={`badge ${
              leave.status === 'Approved' ? 'badge-success'
            : leave.status === 'Rejected' ? 'badge-danger'
            : 'badge-warn'
            }`}>
              {leave.status}
            </span>

            {/* Approve / Reject buttons only shown for pending requests */}
            {leave.status === 'Pending' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button className="btn btn-sm btn-success" onClick={() => updateStatus(leave.leave_id, 'Approved')}>
                  ✓ Approve
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => updateStatus(leave.leave_id, 'Rejected')}>
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {leaves.length === 0 && (
        <div className="empty">
          <div className="icon">🏖</div>
          <p>No leave requests found</p>
        </div>
      )}
    </div>
  );
}

export default AdminLeaves;