const { sql, poolPromise } = require('../config/db');

const Leave = {

  getAllLeaves: async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT l.leave_id, s.name AS student_name,
             l.from_date, l.to_date, l.status
      FROM LeaveRequests l
      JOIN Students s ON l.student_id = s.student_id
    `);

    return result.recordset;
  },

  getLeavesByStudent: async (studentId) => {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('studentId', sql.Int, studentId)
      .query(`
        SELECT leave_id, from_date, to_date, status
        FROM LeaveRequests
        WHERE student_id = @studentId
      `);

    return result.recordset;
  },
requestLeave: async (student_id, from_date, to_date) => {
  const pool = await poolPromise;

  await pool.request()
    .input('student_id', sql.Int, student_id)
    .input('from_date', sql.Date, from_date)
    .input('to_date', sql.Date, to_date)
    .query(`
      INSERT INTO LeaveRequests (student_id, from_date, to_date, status)
      VALUES (@student_id, @from_date, @to_date, 'Pending')
    `);
},

  updateLeaveStatus: async (id, status) => {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE LeaveRequests
        SET status = @status
        WHERE leave_id = @id
      `);
  }

};

module.exports = Leave;
