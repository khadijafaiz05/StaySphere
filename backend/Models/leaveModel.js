const { sql, poolPromise } = require('../config/db');

const Leave = {
  async getAllLeaves() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT l.leave_id, s.name AS student_name,
             l.from_date, l.to_date, l.status
      FROM LeaveRequests l
      JOIN Students s ON l.student_id = s.student_id
    `);
    return result.recordset;
  },

  async requestLeave(student_id, from_date, to_date) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('from_date', sql.Date, from_date)
      .input('to_date', sql.Date, to_date)
      .query(`
        INSERT INTO LeaveRequests (leave_id, student_id, from_date, to_date, status)
        VALUES ((SELECT ISNULL(MAX(leave_id),0)+1 FROM LeaveRequests),
                @student_id, @from_date, @to_date, 'Pending')
      `);
  },

  async updateLeaveStatus(id, status) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar, status)
      .query('UPDATE LeaveRequests SET status=@status WHERE leave_id=@id');
  }
};

module.exports = Leave;
