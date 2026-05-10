const { sql, poolPromise } = require('../config/db');

const Visitor = {

  getVisitorsByStudent: async (studentId) => {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('studentId', sql.Int, studentId)
      .query(`
        SELECT * FROM Visitors
        WHERE student_id = @studentId
      `);

    return result.recordset;
  },

  addVisitor: async (student_id, visitor_name, entry_time) => {
    const pool = await poolPromise;

    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('visitor_name', sql.VarChar, visitor_name)
      .input('entry_time', sql.DateTime, entry_time)
      .query(`
  INSERT INTO Visitors (student_id, visitor_name, entry_time)
  VALUES (
    @student_id,
    @visitor_name,
    @entry_time
  )
`);
  },

  recordExit: async (id, exit_time) => {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('exit_time', sql.DateTime, exit_time)
      .query(`
        UPDATE Visitors
        SET exit_time = @exit_time
        WHERE visitor_id = @id
      `);
  },

  deleteVisitor: async (id) => {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM Visitors
        WHERE visitor_id = @id
      `);
  }

};

module.exports = Visitor;
