const { sql, poolPromise } = require('../config/db');

const Attendance = {
  async getAllLogs() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT a.log_id, s.name AS student_name,
             a.entry_time, a.exit_time
      FROM AttendanceLogs a
      JOIN Students s ON a.student_id = s.student_id
    `);
    return result.recordset;
  },

  async logEntry(student_id, entry_time) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('entry_time', sql.DateTime, entry_time)
      .query(`
        INSERT INTO AttendanceLogs (log_id, student_id, entry_time)
        VALUES ((SELECT ISNULL(MAX(log_id),0)+1 FROM AttendanceLogs),
                @student_id, @entry_time)
      `);
  },

  async logExit(id, exit_time) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('exit_time', sql.DateTime, exit_time)
      .query('UPDATE AttendanceLogs SET exit_time=@exit_time WHERE log_id=@id');
  }
};

module.exports = Attendance;
