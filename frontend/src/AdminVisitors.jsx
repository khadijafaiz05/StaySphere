import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

function AdminVisitors() {
  const [visitorName, setVisitorName] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [studentId, setStudentId] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [exitTimes, setExitTimes] = useState({});

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`${API}/visitors`);
      const data = await res.json();
      setVisitors(data);
    } catch {
      alert('Failed to load visitors');
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const visitorData = {
      student_id: studentId,
      visitor_name: visitorName,
      entry_time: entryTime
    };
    try {
      const res = await fetch(`${API}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setVisitorName('');
        setEntryTime('');
        setStudentId('');
        fetchVisitors();
      } else {
        alert(data.error);
      }
    } catch {
      alert('Server Error');
    }
  };

  const recordExit = async (visitorId) => {
    const exit_time = exitTimes[visitorId];
    if (!exit_time) { alert('Please enter exit time'); return; }
    try {
      const res = await fetch(`${API}/visitors/${visitorId}/exit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exit_time })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setExitTimes((prev) => ({ ...prev, [visitorId]: '' }));
        fetchVisitors();
      } else {
        alert(data.error);
      }
    } catch {
      alert('Server Error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Add Visitor Record</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter Visitor Name"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="datetime-local"
          value={entryTime}
          onChange={(e) => setEntryTime(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Add Visitor</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>All Visitor Records</h3>

      {visitors.map((v) => (
        <div
          key={v.visitor_id}
          style={{ border: '1px solid gray', padding: '15px', margin: '15px auto', width: '500px' }}
        >
          <p><b>Student:</b> {v.student_name}</p>
          <p><b>Visitor:</b> {v.visitor_name}</p>
          <p><b>Entry Time:</b> {v.entry_time}</p>
          <p><b>Exit Time:</b> {v.exit_time || 'Still Inside'}</p>

          {!v.exit_time && (
            <>
              <input
                type="datetime-local"
                value={exitTimes[v.visitor_id] || ''}
                onChange={(e) => setExitTimes((prev) => ({ ...prev, [v.visitor_id]: e.target.value }))}
              />
              <button onClick={() => recordExit(v.visitor_id)} style={{ marginLeft: '10px' }}>
                Record Exit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminVisitors;