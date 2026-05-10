const { sql, poolPromise } = require('../config/db');

const Attendance = {
  async getAllLogs() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT a.log_id, s.name, a.entry_time, a.exit_time,
             DATEDIFF(HOUR, a.entry_time, a.exit_time) AS hours_spent
      FROM AttendanceLogs a
      JOIN Students s ON a.student_id = s.student_id
      ORDER BY a.entry_time DESC
    `);
    return result.recordset;
  },

  async getLogsByStudent(studentId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('studentId', sql.Int, studentId)
      .query(`
        SELECT log_id, entry_time, exit_time,
               DATEDIFF(HOUR, entry_time, exit_time) AS hours_spent
        FROM AttendanceLogs
        WHERE student_id = @studentId
        ORDER BY entry_time DESC
      `);
    return result.recordset;
  },

  async logEntry(student_id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('student_id', sql.Int, student_id)
      .query(`
        INSERT INTO AttendanceLogs (student_id, entry_time)
        OUTPUT INSERTED.log_id
        VALUES (@student_id, GETDATE())
      `);
    return result.recordset[0];
  },

  async logExit(logId) {
    const pool = await poolPromise;
    await pool.request()
      .input('logId', sql.Int, logId)
      .query('UPDATE AttendanceLogs SET exit_time = GETDATE() WHERE log_id = @logId');
  }
};

module.exports = Attendance;