import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

function Complaints() {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [complaints,  setComplaints]  = useState([]);
  const [alert,       setAlert]       = useState(null);
  const [showForm,    setShowForm]    = useState(false);

  const fetchComplaints = async () => {
    try {
      const res  = await fetch(`${API}/complaints/student/${studentId}`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load complaints');
      setComplaints(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { if (studentId) fetchComplaints(); }, [studentId]);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(`${API}/complaints`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify({ student_id: studentId, category, description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit complaint');
      showAlert('Complaint submitted successfully');
      setCategory(''); setDescription(''); setShowForm(false);
      fetchComplaints();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status_name === 'Pending').length;
  const resolved = complaints.filter(c => c.status_name === 'Resolved').length;

  const statusBadge = (status) => {
    if (status === 'Resolved')   return 'badge-success';
    if (status === 'In Progress') return 'badge-info';
    return 'badge-warn';
  };

  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>My Complaints</h2>
          <p>Submit and track your complaints</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Complaint'}
        </button>
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
          <div className="label">Total</div>
          <div className="value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{pending}</div>
        </div>
        <div className="stat-card">
          <div className="label">Resolved</div>
          <div className="value" style={{ color: 'var(--success)' }}>{resolved}</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="checkin-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Submit a Complaint</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet</option>
                <option value="Classroom">Classroom</option>
                <option value="Hostel Room">Hostel Room</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe your complaint in detail..."
                value={description}
                rows="4"
                onChange={e => setDescription(e.target.value)}
                required
                style={{
                  width: '100%', background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontFamily: 'inherit',
                  fontSize: '0.9rem', padding: '0.6rem 0.8rem',
                  resize: 'vertical', boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
              Submit Complaint
            </button>
          </form>
        </div>
      )}

      {/* Complaints table */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>Complaint History</h3>
          <button className="btn btn-sm btn-ghost" onClick={fetchComplaints}>↻ Refresh</button>
        </div>

        {complaints.length === 0 ? (
          <div className="empty">
            <div className="icon">📋</div>
            <p>No complaints submitted yet</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c.complaint_id}>
                  <td style={{ fontFamily: "'DM Mono', monospace", color: 'var(--muted)', fontSize: '0.82rem' }}>
                    {i + 1}
                  </td>
                  <td style={{ fontWeight: 500 }}>{c.category}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: '300px' }}>
                    {c.description}
                  </td>
                  <td>
                    <span className={`badge ${statusBadge(c.status_name)}`}>
                      {c.status_name}
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

export default Complaints;