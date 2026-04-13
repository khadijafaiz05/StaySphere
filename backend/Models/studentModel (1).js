const { sql, poolPromise } = require('../config/db');

const Student = {
  async getAllStudents() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT student_id, name, phone, address FROM Students');
    return result.recordset;
  },

  async getStudentById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT student_id, name, phone, address FROM Students');
    return result.recordset[0];
  },

 async searchStudentByName(name) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar, `${name}%`)
      .query('SELECT * FROM Students WHERE name LIKE @name');
    return result.recordset;
  },
  
  async createStudent(user_id, name, phone, address) {
    const pool = await poolPromise;
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('name', sql.VarChar, name)
      .input('phone', sql.VarChar, phone)
      .input('address', sql.VarChar, address)
      .query(`
        INSERT INTO Students (student_id, user_id, name, phone, gender, address)
        VALUES ((SELECT ISNULL(MAX(student_id),0)+1 FROM Students),
                @user_id, @name, @phone, 'Female', @address)
      `);
  },

  async updateStudent(id, name, phone, address) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('phone', sql.VarChar, phone)
      .input('address', sql.VarChar, address)
      .query(`
        UPDATE Students
        SET name=@name, phone=@phone, address=@address
        WHERE student_id=@id
      `);
  },

  async deleteStudent(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Students WHERE student_id = @id');
  }
};

module.exports = Student;
