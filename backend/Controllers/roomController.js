const Room = require('../Models/roomModel');

exports.getAllRooms = async (req, res) => {
  try { res.json(await Room.getAllRooms()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getAllAllocations = async (req, res) => {
  try { res.json(await Room.getAllAllocations()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.allocateRoom = async (req, res) => {
  try {
    const { student_id, room_id, allocation_date } = req.body;
    await Room.allocateRoom(student_id, room_id, allocation_date);
    res.status(201).json({ message: 'Room allocated successfully' });
  } catch (err) {
    console.error('Allocate room error:', err);
    res.status(500).json({ error: err.message }); 
  }
};
exports.deallocateRoom = async (req, res) => {
  try {
    await Room.deallocateRoom(req.params.allocation_id);
    res.json({ message: 'Room deallocated successfully' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};