const { sql, poolPromise } = require('../Models/db');

exports.getAllLogs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT a.log_id, s.name, a.entry_time, a.exit_time,
             DATEDIFF(HOUR, a.entry_time, a.exit_time) AS hours_spent
      FROM AttendanceLogs a
      JOIN Students s ON a.student_id = s.student_id
      ORDER BY a.entry_time DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentLogs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('studentId', sql.Int, req.params.studentId)
      .query(`
        SELECT log_id, entry_time, exit_time,
               DATEDIFF(HOUR, entry_time, exit_time) AS hours_spent
        FROM AttendanceLogs
        WHERE student_id = @studentId
        ORDER BY entry_time DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('student_id', sql.Int, req.body.student_id)
      .query('INSERT INTO AttendanceLogs (student_id, entry_time) OUTPUT INSERTED.log_id VALUES (@student_id, GETDATE())');
    res.json({ log_id: result.recordset[0].log_id, message: 'Check-in recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('logId', sql.Int, req.params.logId)
      .query('UPDATE AttendanceLogs SET exit_time = GETDATE() WHERE log_id = @logId');
    res.json({ message: 'Check-out recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};