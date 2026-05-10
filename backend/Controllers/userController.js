const { sql, poolPromise } = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'staysphere_secret_key_2026';

exports.login = async (req, res) => {
  const { username, password, loginAs } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query(`SELECT u.user_id, u.username, u.password, r.role_name
              FROM Users u JOIN Roles r ON u.role_id = r.role_id
              WHERE u.username = @username`);

    if (!result.recordset.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.recordset[0];
    if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' });

    if (loginAs && user.role_name !== loginAs) {
      return res.status(403).json({
        error: `This account is not registered as ${loginAs}. Please log in to your specific portal`
      });
    }

    let studentId = null;
    if (user.role_name === 'Student') {
      const sResult = await pool.request()
        .input('user_id', sql.Int, user.user_id)
        .query('SELECT student_id FROM Students WHERE user_id = @user_id');
      if (sResult.recordset.length) studentId = sResult.recordset[0].student_id;
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role_name, studentId },
      JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, role: user.role_name, username: user.username, studentId });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = (req, res) => res.json(req.user);
