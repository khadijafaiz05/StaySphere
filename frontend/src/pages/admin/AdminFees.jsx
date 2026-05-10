import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

const FeeManagement = () => {
  const [students,  setStudents]  = useState([]);
  const [fees,      setFees]      = useState([]);
  const [studentId, setStudentId] = useState('');
  const [amount,    setAmount]    = useState('');
  const [dueDate,   setDueDate]   = useState('');
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');

  useEffect(() => {
    loadStudents();
    loadFees();
  }, []);

  /*  fetch all students for the dropdown  */
  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/students`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load students');
      setStudents(await res.json());
    } catch (e) { setError(e.message); }
  };

  /* fetch all fee records */
  const loadFees = async () => {
    try {
      const res = await fetch(`${API}/fees`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load fees');
      setFees(await res.json());
    } catch (e) { setError(e.message); }
  };

  /*  submit new fee record  */
  const addFee = async (event) => {
    event.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API}/fees`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ student_id: studentId, amount, due_date: dueDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add fee');
      setSuccess(data.message);
      setStudentId(''); setAmount(''); setDueDate('');
      loadFees();
    } catch (e) { setError(e.message); }
  };

  /*  fee summary stats  */
  const totalAmount  = fees.reduce((a, f) => a + Number(f.amount || 0), 0);
  const totalPending = fees.filter(f => f.status !== 'Paid').length;
  const totalPaid    = fees.filter(f => f.status === 'Paid').length;

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Fee Management</h2>
          <p>Assign and track student fee records</p>
        </div>
      </div>

      {/*  Alert banners  */}
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/*  Summary stats  */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Records</div>
          <div className="value">{fees.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Amount</div>
          <div className="value">₨{(totalAmount / 1000).toFixed(0)}k</div>
          <div className="sub">₨{totalAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="label">Paid</div>
          <div className="value" style={{ color: 'var(--success)' }}>{totalPaid}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{totalPending}</div>
        </div>
      </div>

      {/*  Add fee form  */}
      <div className="checkin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Assign New Fee</h3>
        <form onSubmit={addFee}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'flex-end' }}>

            {/* Student selector */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Student</label>
              <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Amount (₨)</label>
              <input
                type="number" placeholder="e.g. 15000" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)} required
              />
            </div>

            {/* Due date */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginBottom: '1.2rem' }}>
              Add Fee
            </button>
          </div>
        </form>
      </div>

      {/*  All fees table  */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Fee Records</h3>
          {/* Refresh button reloads fee data from server */}
          <button className="btn btn-sm btn-ghost" onClick={loadFees}>↻ Refresh</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Fee ID</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(fee => (
              <tr key={fee.fee_id}>
                <td style={{ fontWeight: 500 }}>{fee.name}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", color: 'var(--muted)', fontSize: '0.82rem' }}>#{fee.fee_id}</td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>₨{Number(fee.amount).toLocaleString()}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>{fee.due_date?.substring(0, 10)}</td>
                {/* Status badge: green = paid, orange = pending/overdue */}
                <td>
                  <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : fee.status === 'Overdue' ? 'badge-danger' : 'badge-warn'}`}>
                    {fee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fees.length === 0 && (
          <div className="empty">
            <div className="icon">💳</div>
            <p>No fee records yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;
