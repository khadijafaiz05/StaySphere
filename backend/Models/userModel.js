const { sql, poolPromise } = require('../config/db');

const User = {
  async login(username, password) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT u.user_id, u.username, r.role_name
        FROM Users u
        JOIN Roles r ON u.role_id = r.role_id
        WHERE u.username = @username AND u.password = @password
      `);
    return result.recordset[0];
  }
};

module.exports = User;
