const { sql, poolPromise } = require('../Models/db');

exports.getAllStudents = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.student_id, s.name, s.phone, s.gender, s.address,
             u.username,
             r.room_number, rt.type_name AS room_type, ra.allocation_date,
             COALESCE(SUM(f.amount), 0) AS total_fees,
             COALESCE(SUM(p.amount_paid), 0) AS total_paid
      FROM Students s
      JOIN Users u ON s.user_id = u.user_id
      LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id
      LEFT JOIN Rooms r ON ra.room_id = r.room_id
      LEFT JOIN RoomTypes rt ON r.type_id = rt.type_id
      LEFT JOIN Fees f ON s.student_id = f.student_id
      LEFT JOIN Payments p ON f.fee_id = p.fee_id
      GROUP BY s.student_id, s.name, s.phone, s.gender, s.address,
               u.username, r.room_number, rt.type_name, ra.allocation_date
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT s.*, u.username, r.room_number, rt.type_name AS room_type, ra.allocation_date
        FROM Students s
        JOIN Users u ON s.user_id = u.user_id
        LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id
        LEFT JOIN Rooms r ON ra.room_id = r.room_id
        LEFT JOIN RoomTypes rt ON r.type_id = rt.type_id
        WHERE s.student_id = @id
      `);
    if (!result.recordset.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT s.student_id, s.name, s.phone, s.gender, s.address,
               u.username,
               r.room_number, rt.type_name AS room_type, ra.allocation_date,
               COALESCE(SUM(f.amount), 0) AS total_fees,
               COALESCE(SUM(p.amount_paid), 0) AS total_paid
        FROM Students s
        JOIN Users u ON s.user_id = u.user_id
        LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id
        LEFT JOIN Rooms r ON ra.room_id = r.room_id
        LEFT JOIN RoomTypes rt ON r.type_id = rt.type_id
        LEFT JOIN Fees f ON s.student_id = f.student_id
        LEFT JOIN Payments p ON f.fee_id = p.fee_id
        WHERE s.student_id = @id
        GROUP BY s.student_id, s.name, s.phone, s.gender, s.address,
                 u.username, r.room_number, rt.type_name, ra.allocation_date
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = async (req, res) => {
  const { username, password, name, phone, address } = req.body;
  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const uResult = await transaction.request()
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, password)
        .query('INSERT INTO Users (username, password, role_id) OUTPUT INSERTED.user_id VALUES (@username, @password, 2)');
      const userId = uResult.recordset[0].user_id;

      const sResult = await transaction.request()
        .input('user_id', sql.Int, userId)
        .input('name', sql.VarChar, name)
        .input('phone', sql.VarChar, phone)
        .input('address', sql.VarChar, address)
        .query('INSERT INTO Students (user_id, name, phone, gender, address) OUTPUT INSERTED.student_id VALUES (@user_id, @name, @phone, \'Female\', @address)');

      await transaction.commit();
      res.json({ student_id: sResult.recordset[0].student_id, message: 'Student added' });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('phone', sql.VarChar, phone)
      .input('address', sql.VarChar, address)
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Students SET name=@name, phone=@phone, address=@address WHERE student_id=@id');
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Students WHERE student_id=@id');
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};