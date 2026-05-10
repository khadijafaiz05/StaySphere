import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

function RoomAllocations() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [allocationDate, setAllocationDate] = useState('');

  useEffect(() => {
    loadStudents();
    loadAvailableRooms();
    loadAllocations();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/students`);
      const data = await res.json();
      setStudents(data);
    } catch { alert('Failed to load students'); }
  };

  const loadAvailableRooms = async () => {
    try {
      const res = await fetch(`${API}/rooms`);
      const data = await res.json();
      setRooms(data.filter(r => r.status === 'Available'));
    } catch { alert('Failed to load rooms'); }
  };

  const loadAllocations = async () => {
    try {
      const res = await fetch(`${API}/rooms/allocations`);
      const data = await res.json();
      setAllocations(data);
    } catch { alert('Failed to load allocations'); }
  };

  const allocateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/rooms/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, room_id: roomId, allocation_date: allocationDate })
      });
      if (res.ok) {
        alert('Room allocated successfully');
        setStudentId(''); setRoomId(''); setAllocationDate('');
        loadAllocations(); loadAvailableRooms();
      } else { alert('Failed to allocate room'); }
    } catch { alert('Server Error'); }
  };

  const deallocate = async (id) => {
    try {
      const res = await fetch(`${API}/rooms/allocations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Room deallocated successfully');
        loadAllocations(); loadAvailableRooms();
      } else { alert('Failed to deallocate room'); }
    } catch { alert('Server Error'); }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Room Allocations</h2>

      <form onSubmit={allocateRoom} style={{ marginBottom: '30px' }}>
        <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s.student_id} value={s.student_id}>{s.name}</option>
          ))}
        </select>

        <br /><br />

        <select value={roomId} onChange={e => setRoomId(e.target.value)} required>
          <option value="">Select Room</option>
          {rooms.map(r => (
            <option key={r.room_id} value={r.room_id}>{r.room_number}</option>
          ))}
        </select>

        <br /><br />

        <input
          type="date"
          value={allocationDate}
          onChange={e => setAllocationDate(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Allocate Room</button>
      </form>

      <h3>All Allocations</h3>

      {allocations.map(a => (
        <div
          key={a.allocation_id}
          style={{ border: '1px solid gray', padding: '15px', margin: '15px auto', width: '500px' }}
        >
          <p><b>Student:</b> {a.student_name}</p>
          <p><b>Room:</b> {a.room_number}</p>
          <p><b>Date:</b> {a.allocation_date}</p>
          <button onClick={() => deallocate(a.allocation_id)}>Deallocate</button>
        </div>
      ))}
    </div>
  );
}

export default RoomAllocations;