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

  const [updateRoomId, setUpdateRoomId] = useState('');
  const [updateRoomNumber, setUpdateRoomNumber] = useState('');
  const [updateTypeId, setUpdateTypeId] = useState('');

  const [alert, setAlert] = useState(null);

  useEffect(() => { loadRoomTypes(); loadRooms(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const loadRoomTypes = async () => {
    try {
      const res = await fetch(`${API}/rooms/types`, { headers: authHeader() });
      const data = await res.json();
      setTypes(data);
    } catch { showAlert('Failed to load room types', 'error'); }
  };

  const loadRooms = async () => {
    try {
      const res = await fetch(`${API}/rooms`, { headers: authHeader() });
      const data = await res.json();
      setRooms(data);
    } catch { showAlert('Failed to load rooms', 'error'); }
  };

  const handleRoomSelect = (e) => {
    const selectedId = e.target.value;
    setUpdateRoomId(selectedId);

    if (!selectedId) {
      setUpdateRoomNumber('');
      setUpdateTypeId('');
      return;
    }

    const room = rooms.find(r => String(r.room_id) === String(selectedId));
    if (room) {
      setUpdateRoomNumber(room.room_number);
      const matched = types.find(t => t.type_name === room.type_name);
      setUpdateTypeId(matched ? String(matched.type_id) : '');
    }
  };

  const addRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/rooms`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ room_number: roomNumber, type_id: typeId })
      });
      if (!res.ok) throw new Error('Failed to add room');
      showAlert('Room added successfully');
      setRoomNumber('');
      setTypeId('');
      loadRooms();
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const updateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/rooms/${updateRoomId}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({
          room_number: updateRoomNumber,
          type_id: updateTypeId
        })
      });
      if (!res.ok) throw new Error('Failed to update room');
      showAlert('Room updated successfully');
      setUpdateRoomId('');
      setUpdateRoomNumber('');
      setUpdateTypeId('');
      loadRooms();
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const available = rooms.filter(r => r.status === 'Available').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;

  return (
    <div className="page fade-in">

      <div className="page-header">
        <div className="page-title">
          <h2>Room Management</h2>
          <p>Add, update, and monitor hostel rooms</p>
        </div>
      </div>

      {alert && (
        <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {alert.msg}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Rooms</div>
          <div className="value">{rooms.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Available</div>
          <div className="value" style={{ color: 'var(--success)' }}>{available}</div>
        </div>
        <div className="stat-card">
          <div className="label">Occupied</div>
          <div className="value" style={{ color: 'var(--warn)' }}>{occupied}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Add Room */}
        <div className="checkin-card">
          <h3>Add New Room</h3>
          <form onSubmit={addRoom}>
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select value={typeId} onChange={e => setTypeId(e.target.value)} required>
                <option value="">Select type</option>
                {types.map(t => (
                  <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" type="submit">Add Room</button>
          </form>
        </div>

        {/* Update Room */}
        <div className="checkin-card">
          <h3>Update Existing Room</h3>

          <form onSubmit={updateRoom}>
            <div className="form-group">
              <label>Select Room</label>
              <select value={updateRoomId} onChange={handleRoomSelect} required>
                <option value="">Select a room</option>
                {rooms.map(r => (
                  <option key={r.room_id} value={r.room_id}>
                    #{r.room_id} — {r.room_number} ({r.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                value={updateRoomNumber}
                onChange={e => setUpdateRoomNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select value={updateTypeId} onChange={e => setUpdateTypeId(e.target.value)} required>
                <option value="">Select type</option>
                {types.map(t => (
                  <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" type="submit">Update Room</button>
          </form>
        </div>

      </div>

      {/* Table */}
      <div className="table-wrap">
        <h3>All Rooms</h3>

        <table>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Room Number</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map(r => (
              <tr key={r.room_id}>
                <td>{r.room_id}</td>
                <td>{r.room_number}</td>
                <td>{r.type_name}</td>
                <td>
                  <span className={`badge ${r.status === 'Available' ? 'badge-success' : 'badge-warn'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default RoomManagement;