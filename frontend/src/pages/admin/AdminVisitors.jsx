import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

function AdminVisitors() {
  const [visitorName, setVisitorName] = useState('');
  const [entryTime,   setEntryTime]   = useState('');
  const [studentId,   setStudentId]   = useState('');
  const [visitors,    setVisitors]    = useState([]);
  const [exitTimes,   setExitTimes]   = useState({}); 
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  const fetchVisitors = async () => {
    try {
      const res  = await fetch(`${API}/visitors`);
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to load visitors');
      setVisitors(data);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { fetchVisitors(); }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, visitor_name: visitorName, entry_time: entryTime })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server Error');
      setSuccess(data.message);
      setVisitorName(''); setEntryTime(''); setStudentId('');
      fetchVisitors();
    } catch (e) { setError(e.message); }
  };


  const recordExit = async (visitorId) => {
    const exit_time = exitTimes[visitorId];
    if (!exit_time) { setError('Please enter an exit time first'); return; }
    try {
      const res  = await fetch(`${API}/visitors/${visitorId}/exit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exit_time })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server Error');
      setSuccess(data.message);
      setExitTimes(prev => ({ ...prev, [visitorId]: '' }));
      fetchVisitors();
    } catch (e) { setError(e.message); }
  };


  const inside = visitors.filter(v => !v.exit_time);

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Visitors</h2>
          <p>Log and manage visitor entry and exit</p>
        </div>
      </div>

      {/*  Alert banners  */}
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/*  Summary stats  */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Visitors</div>
          <div className="value">{visitors.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Currently Inside</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{inside.length}</div>
        </div>
      </div>

      {/*  Add visitor form */}
      <div className="checkin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Register Visitor Entry</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'flex-end' }}>

            {/* Student ID this visitor is visiting */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Student ID</label>
              <input type="number" placeholder="e.g. 3" value={studentId} onChange={e => setStudentId(e.target.value)} required />
            </div>

            {/* Visitor name */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Visitor Name</label>
              <input type="text" placeholder="e.g. Ahmed Khan" value={visitorName} onChange={e => setVisitorName(e.target.value)} required />
            </div>

            {/* Entry time */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Entry Time</label>
              <input type="datetime-local" value={entryTime} onChange={e => setEntryTime(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginBottom: '1.2rem' }}>
              Add Visitor
            </button>
          </div>
        </form>
      </div>

      {/*  All visitor records  */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Visitor Records</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Visitor</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v.visitor_id}>
                <td style={{ fontWeight: 500 }}>{v.student_name}</td>
                <td>{v.visitor_name}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>{v.entry_time}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                  {v.exit_time || <span className="badge badge-warn">Still Inside</span>}
                </td>

                {/* If visitor hasn't exited: show exit time picker + button */}
                <td>
                  {v.exit_time
                    ? <span className="badge badge-success">Exited</span>
                    : (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="datetime-local"
                          value={exitTimes[v.visitor_id] || ''}
                          onChange={e => setExitTimes(prev => ({ ...prev, [v.visitor_id]: e.target.value }))}
                          style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.82rem', padding: '0.3rem 0.6rem' }}
                        />
                        <button className="btn btn-sm btn-info" onClick={() => recordExit(v.visitor_id)}>
                          Record Exit
                        </button>
                      </div>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visitors.length === 0 && (
          <div className="empty">
            <div className="icon">👤</div>
            <p>No visitor records yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVisitors;