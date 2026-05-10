import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error,      setError]      = useState('');

  const fetchComplaints = async () => {
    try {
      const res  = await fetch(`${API}/complaints`);
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to load complaints');
      setComplaints(data);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const resolveComplaint = async (id) => {
    try {
      const res = await fetch(`${API}/complaints/${id}/resolve`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to resolve complaint');
      fetchComplaints();
    } catch (e) { setError(e.message); }
  };

  const pending  = complaints.filter(c => c.status_name === 'Pending');
  const resolved = complaints.filter(c => c.status_name !== 'Pending');

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Complaints</h2>
          <p>Review and resolve student complaints</p>
        </div>
      </div>

      {/*  Error alert  */}
      {error && <div className="alert alert-error">{error}</div>}

      {/*  Summary stats  */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total</div>
          <div className="value">{complaints.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{pending.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Resolved</div>
          <div className="value" style={{ color: 'var(--success)' }}>{resolved.length}</div>
        </div>
      </div>

      {/*  Complaint cards  */}
      <div className="att-list">
        {complaints.map(c => (
          <div key={c.complaint_id} className="att-item" style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>

            {/* Status dot: orange = pending, green = resolved */}
            <div className="att-dot" style={{
              marginTop: '4px',
              background: c.status_name === 'Pending' ? 'var(--warn)' : 'var(--success)'
            }} />

            {/* Complaint details */}
            <div className="att-info" style={{ flex: 1, minWidth: 200 }}>
              <div className="att-date">{c.student_name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                {c.category}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.3rem', lineHeight: 1.5 }}>
                {c.description}
              </div>
            </div>

            {/* Status badge + resolve button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span className={`badge ${c.status_name === 'Pending' ? 'badge-warn' : 'badge-success'}`}>
                {c.status_name}
              </span>

              {/* Resolve button only shown for pending complaints */}
              {c.status_name === 'Pending' && (
                <button className="btn btn-sm btn-success" onClick={() => resolveComplaint(c.complaint_id)}>
                  ✓ Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {complaints.length === 0 && (
        <div className="empty">
          <div className="icon">📋</div>
          <p>No complaints found</p>
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;