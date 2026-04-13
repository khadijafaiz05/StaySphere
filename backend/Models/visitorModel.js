const { sql, poolPromise } = require('../config/db');

const Visitor = {
  async getAllVisitors() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT v.visitor_id, s.name AS student_name,
             v.visitor_name, v.entry_time, v.exit_time
      FROM Visitors v
      JOIN Students s ON v.student_id = s.student_id
    `);
    return result.recordset;
  },

  async addVisitor(student_id, visitor_name, entry_time) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('visitor_name', sql.VarChar, visitor_name)
      .input('entry_time', sql.DateTime, entry_time)
      .query(`
        INSERT INTO Visitors (visitor_id, student_id, visitor_name, entry_time)
        VALUES ((SELECT ISNULL(MAX(visitor_id),0)+1 FROM Visitors),
                @student_id, @visitor_name, @entry_time)
      `);
  },

  async recordExit(id, exit_time) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('exit_time', sql.DateTime, exit_time)
      .query('UPDATE Visitors SET exit_time = @exit_time WHERE visitor_id = @id');
  },

  async deleteVisitor(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Visitors WHERE visitor_id = @id');
  }
};

module.exports = Visitor;
