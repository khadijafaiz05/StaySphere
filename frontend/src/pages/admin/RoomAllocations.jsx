import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';


const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('ss_token')}`
});

function RoomAllocations() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [studentId, setStudentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [allocationDate, setAllocationDate] = useState('');

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadStudents();
    loadAvailableRooms();
    loadAllocations();
  }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ── Students ── */
  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/students`, {
        headers: authHeaders()
      });
      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data.students || data.data || [];

      setStudents(list);
    } catch {
      showAlert('Failed to load students', 'error');
    }
  };

  /*  Rooms (only available)  */
  const loadAvailableRooms = async () => {
    try {
      const res = await fetch(`${API}/rooms`, {
        headers: authHeaders()
      });
      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data.rooms || data.data || [];

      setRooms(list.filter(r => r.status === 'Available'));
    } catch {
      showAlert('Failed to load rooms', 'error');
    }
  };

  /*  Allocations  */
  const loadAllocations = async () => {
    try {
      const res = await fetch(`${API}/rooms/allocations`, {
        headers: authHeaders()
      });
      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data.allocations || data.data || [];

      setAllocations(list);
    } catch {
      showAlert('Failed to load allocations', 'error');
    }
  };

  /*  Allocate Room  */
  const allocateRoom = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/rooms/allocate`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          student_id: studentId,
          room_id: roomId,
          allocation_date: allocationDate
        })
      });

      if (!res.ok) throw new Error('Failed to allocate room');

      showAlert('Room allocated successfully');

      setStudentId('');
      setRoomId('');
      setAllocationDate('');

      loadStudents();
      loadAllocations();
      loadAvailableRooms();

    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  /*  Deallocate  */
  const deallocate = async (id) => {
    if (!window.confirm('Deallocate this room?')) return;

    try {
      const res = await fetch(`${API}/rooms/allocations/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Failed to deallocate room');

      showAlert('Room deallocated');

      loadStudents();
      loadAllocations();
      loadAvailableRooms();

    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const unallocatedStudents = students.filter(
    s => !allocations.some(a => a.student_id === s.student_id)
  );

  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Room Allocations</h2>
          <p>Assign available rooms to students</p>
        </div>
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
          <div className="label">Active Allocations</div>
          <div className="value">{allocations.length}</div>
        </div>

        <div className="stat-card">
          <div className="label">Available Rooms</div>
          <div className="value" style={{ color: 'var(--success)' }}>
            {rooms.length}
          </div>
        </div>

        <div className="stat-card">
          <div className="label">Unallocated Students</div>
          <div className="value" style={{ color: 'var(--warn)' }}>
            {unallocatedStudents.length}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="checkin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Allocate a Room</h3>

        <form onSubmit={allocateRoom}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '0.8rem',
            alignItems: 'flex-end'
          }}>

            {/* Students — only unallocated */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                <option value="">Select student</option>
                {unallocatedStudents.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rooms */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Room</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              >
                <option value="">Select room</option>
                {rooms.map(r => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.room_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group" style={{ margin: 0 }}>
              <label>Date</label>
              <input
                type="date"
                value={allocationDate}
                onChange={(e) => setAllocationDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Allocate
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Allocations</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Room</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allocations.map(a => (
              <tr key={a.allocation_id}>
                <td>{a.student_name}</td>
                <td>
                  <span className="badge badge-info">
                    {a.room_number}
                  </span>
                </td>
                <td>
                  {a.allocation_date?.substring(0, 10)}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deallocate(a.allocation_id)}
                  >
                    Deallocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allocations.length === 0 && (
          <div className="empty">
            <div className="icon">🗝</div>
            <p>No active allocations</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomAllocations;