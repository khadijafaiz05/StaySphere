
const { sql, poolPromise } = require('../config/db');

const Room = {
  async getRoomTypes() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT type_id, type_name, capacity FROM RoomTypes');
    return result.recordset;
  },

  
  async addRoom(room_number, type_id) {
  const pool = await poolPromise;

  await pool.request()
    .input('room_number', sql.VarChar, room_number)
    .input('type_id', sql.Int, type_id)
    .query(`
      INSERT INTO Rooms (room_number, type_id, status)
      VALUES (@room_number, @type_id, 'Available')
    `);
},

  async updateRoom(id, room_number, type_id, status) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('room_number', sql.VarChar, room_number)
      .input('type_id', sql.Int, type_id)
      .input('status', sql.VarChar, status)
      .query('UPDATE Rooms SET room_number=@room_number, type_id=@type_id WHERE room_id=@id');

  },

  async getAllRooms() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT r.room_id, r.room_number, rt.type_name, r.status
      FROM Rooms r
      JOIN RoomTypes rt ON r.type_id = rt.type_id
    `);
    return result.recordset;
  },

  async getRoomById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT r.room_id, r.room_number, rt.type_name, r.status
        FROM Rooms r
        JOIN RoomTypes rt ON r.type_id = rt.type_id
        WHERE r.room_id = @id
      `);
    return result.recordset[0];
  },

  async getAllAllocations() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
  SELECT ra.allocation_id, ra.student_id, s.name AS student_name,
         r.room_number, ra.allocation_date
  FROM RoomAllocation ra
  JOIN Students s ON ra.student_id = s.student_id
  JOIN Rooms r ON ra.room_id = r.room_id
`);
    return result.recordset;
  },

  async allocateRoom(student_id, room_id, allocation_date) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('room_id', sql.Int, room_id)
      .input('allocation_date', sql.Date, allocation_date)
     .query(`
  INSERT INTO RoomAllocation (student_id, room_id, allocation_date)
  VALUES (@student_id, @room_id, @allocation_date);
  UPDATE Rooms SET status = 'Occupied' WHERE room_id = @room_id;
`);
      
  },

  async deallocateRoom(allocation_id) {
    const pool = await poolPromise;
    const r = await pool.request()
      .input('allocation_id', sql.Int, allocation_id)
      .query('SELECT room_id FROM RoomAllocation WHERE allocation_id = @allocation_id');
    const room_id = r.recordset[0] ? r.recordset[0].room_id : null;

    await pool.request()
      .input('allocation_id', sql.Int, allocation_id)
      .query('DELETE FROM RoomAllocation WHERE allocation_id = @allocation_id');

    if (room_id) {
      await pool.request()
        .input('room_id', sql.Int, room_id)
        .query("UPDATE Rooms SET status = 'Available' WHERE room_id = @room_id");
    }
  }
};

module.exports = Room;
