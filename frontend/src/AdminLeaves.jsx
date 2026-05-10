import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API}/leaves`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load leaves');
      setLeaves(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/leaves/${id}/status`, {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      alert(data.message);
      fetchLeaves();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Manage Leave Requests</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {leaves.map((leave) => (
        <div
          key={leave.leave_id}
          style={{
            border: '1px solid gray',
            padding: '15px',
            margin: '15px auto',
            width: '500px'
          }}
        >
          <p><b>Student:</b> {leave.student_name}</p>
          <p><b>From:</b> {leave.from_date.substring(0, 10)}</p>
          <p><b>To:</b> {leave.to_date.substring(0, 10)}</p>
          <p><b>Status:</b> {leave.status}</p>

          {leave.status === 'Pending' && (
            <>
              <button onClick={() => updateStatus(leave.leave_id, 'Approved')}>
                Approve
              </button>
              <button
                onClick={() => updateStatus(leave.leave_id, 'Rejected')}
                style={{ marginLeft: '10px' }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminLeaves;