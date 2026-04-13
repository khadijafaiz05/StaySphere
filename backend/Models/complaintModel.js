const { sql, poolPromise } = require('../config/db');

const Complaint = {
  async getAllComplaints() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.complaint_id, s.name AS student_name,
             c.description, cs.status_name, c.date_submitted
      FROM Complaints c
      JOIN Students s ON c.student_id = s.student_id
      JOIN ComplaintStatus cs ON c.status_id = cs.status_id
    `);
    return result.recordset;
  },

  async getPendingComplaints() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Complaints WHERE status_id = 1');
    return result.recordset;
  },

  async addComplaint(student_id, description) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('description', sql.VarChar, description)
      .query(`
        INSERT INTO Complaints (complaint_id, student_id, description, status_id, date_submitted)
        VALUES ((SELECT ISNULL(MAX(complaint_id),0)+1 FROM Complaints),
                @student_id, @description, 1, CAST(GETDATE() AS DATE))
      `);
  },

  async resolveComplaint(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Complaints SET status_id = 2 WHERE complaint_id = @id');
  }
};

module.exports = Complaint;
