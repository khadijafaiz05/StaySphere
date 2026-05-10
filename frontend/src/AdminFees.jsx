import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

const styles = {
  page:        { fontFamily: 'Arial, sans-serif', margin: 20 },
  section:     { marginBottom: 40, border: '1px solid #ccc', padding: 20 },
  table:       { width: '100%', borderCollapse: 'collapse' },
  cell:        { border: '1px solid #ddd', padding: 8, textAlign: 'left' },
  formControl: { margin: 5, padding: 5 }
};

const FeeManagement = () => {
  const [students,  setStudents]  = useState([]);
  const [fees,      setFees]      = useState([]);
  const [studentId, setStudentId] = useState('');
  const [amount,    setAmount]    = useState('');
  const [dueDate,   setDueDate]   = useState('');
  const [error,     setError]     = useState('');

  useEffect(() => {
    loadStudents();
    loadFees();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/students`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load students');
      setStudents(await res.json());
    } catch (e) {
      setError(e.message);
    }
  };

  const loadFees = async () => {
    try {
      const res = await fetch(`${API}/fees`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load fees');
      setFees(await res.json());
    } catch (e) {
      setError(e.message);
    }
  };

  const addFee = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${API}/fees`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify({ student_id: studentId, amount, due_date: dueDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add fee');
      alert(data.message);
      setStudentId('');
      setAmount('');
      setDueDate('');
      loadFees();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={styles.page}>
      <h1>StaySphere Admin Panel - Fee Management</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={styles.section}>
        <h2>Add Fee</h2>
        <form onSubmit={addFee}>
          <select
            style={styles.formControl}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            style={styles.formControl}
            type="number"
            placeholder="Amount"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            style={styles.formControl}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <button style={styles.formControl} type="submit">
            Add Fee
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2>All Fees</h2>
        <button style={styles.formControl} onClick={loadFees}>
          Refresh
        </button>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.cell}>Student</th>
              <th style={styles.cell}>Fee ID</th>
              <th style={styles.cell}>Amount</th>
              <th style={styles.cell}>Due Date</th>
              <th style={styles.cell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.fee_id}>
                <td style={styles.cell}>{fee.name}</td>
                <td style={styles.cell}>{fee.fee_id}</td>
                <td style={styles.cell}>{fee.amount}</td>
                <td style={styles.cell}>{fee.due_date}</td>
                <td style={styles.cell}>{fee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;