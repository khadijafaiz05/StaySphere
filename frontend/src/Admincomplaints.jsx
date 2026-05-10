import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API}/complaints`);
      const data = await res.json();
      setComplaints(data);
    } catch {
      alert('Failed to load complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const resolveComplaint = async (id) => {
    try {
      const res = await fetch(`${API}/complaints/${id}/resolve`, {
        method: 'PATCH'
      });

      if (res.ok) {
        alert('Complaint Resolved');
        fetchComplaints();
      } else {
        alert('Failed to resolve complaint');
      }
    } catch {
      alert('Server Error');
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Resolve Complaints</h2>

      {complaints.map((c) => (
        <div
          key={c.complaint_id}
          style={{
            border: '1px solid gray',
            padding: '15px',
            margin: '15px auto',
            width: '500px'
          }}
        >
          <p><b>Student:</b> {c.student_name}</p>
          <p><b>Category:</b> {c.category}</p>
          <p><b>Description:</b> {c.description}</p>
          <p><b>Status:</b> {c.status_name}</p>

          {c.status_name === 'Pending' && (
            <button onClick={() => resolveComplaint(c.complaint_id)}>
              Resolve Complaint
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminComplaints;