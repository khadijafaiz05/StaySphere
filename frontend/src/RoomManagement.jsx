import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

function RoomManagement() {
  const [types, setTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [typeId, setTypeId] = useState('');
  const [status, setStatus] = useState('Available');
  const [updateRoomId, setUpdateRoomId] = useState('');
  const [updateRoomNumber, setUpdateRoomNumber] = useState('');
  const [updateTypeId, setUpdateTypeId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('Available');

  useEffect(() => {
    loadRoomTypes();
    loadRooms();
  }, []);

  const loadRoomTypes = async () => {
    try {
      const res = await fetch(`${API}/rooms/types`, { headers: authHeader() });
      const data = await res.json();
      setTypes(data);
    } catch { alert('Failed to load room types'); }
  };

  const loadRooms = async () => {
    try {
      const res = await fetch(`${API}/rooms`, { headers: authHeader() });
      const data = await res.json();
      setRooms(data);
    } catch { alert('Failed to load rooms'); }
  };

  const addRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/rooms`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ room_number: roomNumber, type_id: typeId, status })
      });
      if (res.ok) {
        alert('Room added successfully');
        setRoomNumber(''); setTypeId(''); setStatus('Available');
        loadRooms();
      } else { alert('Failed to add room'); }
    } catch { alert('Server Error'); }
  };

  const updateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/rooms/${updateRoomId}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ room_number: updateRoomNumber, type_id: updateTypeId, status: updateStatus })
      });
      if (res.ok) {
        alert('Room updated successfully');
        setUpdateRoomId(''); setUpdateRoomNumber(''); setUpdateTypeId(''); setUpdateStatus('Available');
        loadRooms();
      } else { alert('Failed to update room'); }
    } catch { alert('Server Error'); }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Room Management</h2>

      <h3>Add Room</h3>
      <form onSubmit={addRoom}>
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={e => setRoomNumber(e.target.value)}
          required
        />

        <br /><br />

        <select value={typeId} onChange={e => setTypeId(e.target.value)} required>
          <option value="">Select Type</option>
          {types.map(t => (
            <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
          ))}
        </select>

        <br /><br />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>

        <br /><br />

        <button type="submit">Add Room</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>Update Room</h3>
      <form onSubmit={updateRoom}>
        <input
          type="number"
          placeholder="Room ID"
          value={updateRoomId}
          onChange={e => setUpdateRoomId(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="New Room Number"
          value={updateRoomNumber}
          onChange={e => setUpdateRoomNumber(e.target.value)}
          required
        />

        <br /><br />

        <select value={updateTypeId} onChange={e => setUpdateTypeId(e.target.value)} required>
          <option value="">Select Type</option>
          {types.map(t => (
            <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
          ))}
        </select>

        <br /><br />

        <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>

        <br /><br />

        <button type="submit">Update Room</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>All Rooms</h3>

      {rooms.map(r => (
        <div
          key={r.room_id}
          style={{ border: '1px solid gray', padding: '15px', margin: '15px auto', width: '500px' }}
        >
          <p><b>Room ID:</b> {r.room_id}</p>
          <p><b>Room Number:</b> {r.room_number}</p>
          <p><b>Type:</b> {r.type_name}</p>
          <p><b>Status:</b> {r.status}</p>
        </div>
      ))}
    </div>
  );
}

export default RoomManagement;