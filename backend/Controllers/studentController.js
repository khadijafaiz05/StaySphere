const { sql, poolPromise } = require('../config/db');

exports.getAllStudents = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.student_id, s.name, s.phone, s.street,
             u.username,
             c.city_name,
             r.room_number, rt.type_name AS room_type, ra.allocation_date,
             COALESCE(SUM(f.amount), 0)      AS total_fees,
             COALESCE(SUM(p.amount_paid), 0) AS total_paid
      FROM Students s
      JOIN Users u ON s.user_id = u.user_id
      LEFT JOIN Cities c ON s.city_id = c.city_id
      LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id AND ra.vacate_date IS NULL
      LEFT JOIN Rooms r ON ra.room_id = r.room_id
      LEFT JOIN RoomTypes rt ON r.type_id = rt.type_id
      LEFT JOIN Fees f ON s.student_id = f.student_id
      LEFT JOIN Payments p ON f.fee_id = p.fee_id
      GROUP BY s.student_id, s.name, s.phone, s.street,
               u.username, c.city_name, r.room_number, rt.type_name, ra.allocation_date
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
        SELECT s.student_id, s.name, s.phone, s.street, s.city_id,
               u.username,
               r.room_number, rt.type_name AS room_type, ra.allocation_date
        FROM Students s
        JOIN Users u ON s.user_id = u.user_id
        LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id AND ra.vacate_date IS NULL
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
        SELECT s.student_id, s.name, s.phone, s.street,
               u.username,
               c.city_name,
               r.room_number, rt.type_name AS room_type, ra.allocation_date,
               COALESCE(SUM(f.amount), 0)      AS total_fees,
               COALESCE(SUM(p.amount_paid), 0) AS total_paid
        FROM Students s
        JOIN Users u ON s.user_id = u.user_id
        LEFT JOIN Cities c ON s.city_id = c.city_id
        LEFT JOIN RoomAllocation ra ON s.student_id = ra.student_id AND ra.vacate_date IS NULL
        LEFT JOIN Rooms r ON ra.room_id = r.room_id
        LEFT JOIN RoomTypes rt ON r.type_id = rt.type_id
        LEFT JOIN Fees f ON s.student_id = f.student_id
        LEFT JOIN Payments p ON f.fee_id = p.fee_id
        WHERE s.student_id = @id
        GROUP BY s.student_id, s.name, s.phone, s.street,
                 u.username, c.city_name, r.room_number, rt.type_name, ra.allocation_date
      `);
    if (!result.recordset.length) return res.status(404).json({ error: 'Student not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = async (req, res) => {
  const { username, password, name, phone, street, city_id } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'username, password and name are required' });
  }
  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const uResult = await transaction.request()
        .input('username', sql.VarChar(50), username)
        .input('password', sql.VarChar(50), password)
        .query(`
          INSERT INTO Users (username, password, role_id)
          OUTPUT INSERTED.user_id
          VALUES (@username, @password, 2)
        `);
      const userId = uResult.recordset[0].user_id;

      const sResult = await transaction.request()
        .input('user_id', sql.Int,          userId)
        .input('name',    sql.VarChar(100), name)
        .input('phone',   sql.VarChar(15),  phone   || null)
        .input('street',  sql.VarChar(150), street  || null)
        .input('city_id', sql.Int,          city_id || null)
        .query(`
          INSERT INTO Students (user_id, name, phone, street, city_id)
          OUTPUT INSERTED.student_id
          VALUES (@user_id, @name, @phone, @street, @city_id)
        `);

      await transaction.commit();
      res.json({ student_id: sResult.recordset[0].student_id, message: 'Student added' });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { name, phone, street, city_id } = req.body;   
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name',    sql.VarChar(100), name)
      .input('phone',   sql.VarChar(15),  phone   || null)
      .input('street',  sql.VarChar(150), street  || null)
      .input('city_id', sql.Int,          city_id || null)   
      .input('id',      sql.Int,          req.params.id)
      .query(`
        UPDATE Students
        SET name    = @name,
            phone   = @phone,
            street  = @street,
            city_id = @city_id
        WHERE student_id = @id
      `);
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const pool = await poolPromise;
    const id = req.params.id;

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM AttendanceLogs WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM Visitors WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM LeaveRequests WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM Complaints WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM ExtraCharges WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query(`
        DELETE p FROM Payments p
        JOIN Fees f ON p.fee_id = f.fee_id
        WHERE f.student_id = @id
      `);
    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM Fees WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM RoomAllocation WHERE student_id = @id');

    const lookup = await pool.request().input('id', sql.Int, id)
      .query('SELECT user_id FROM Students WHERE student_id = @id');

    await pool.request().input('id', sql.Int, id)
      .query('DELETE FROM Students WHERE student_id = @id');

    if (lookup.recordset.length) {
      await pool.request().input('uid', sql.Int, lookup.recordset[0].user_id)
        .query('DELETE FROM Users WHERE user_id = @uid');
    }

    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT city_id, city_name, province FROM Cities ORDER BY city_name');
    res.json(result.recordset);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
