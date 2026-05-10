const { sql, poolPromise } = require('../config/db');

const Fee = {
  async getAllFees() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.name, f.fee_id, f.amount, f.due_date, f.status
      FROM Fees f
      JOIN Students s ON f.student_id = s.student_id
    `);
    return result.recordset;
  },

  async getTotalPayments() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT SUM(amount_paid) AS TotalPayments FROM Payments');
    return result.recordset[0];
  },

  async addFee(student_id, amount, due_date) {
    const pool = await poolPromise;
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('amount', sql.Decimal, amount)
      .input('due_date', sql.Date, due_date)
      .query(`
         INSERT INTO Fees (student_id, amount, due_date, status)
  VALUES (@student_id, @amount, @due_date, 'Pending')
`);

  },

  async getFeesByStudent(student_id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('student_id', sql.Int, student_id)
    .query('SELECT fee_id, amount, due_date, status FROM Fees WHERE student_id = @student_id');
  return result.recordset;
},

  async makePayment(fee_id, amount_paid, payment_date) {
    const pool = await poolPromise;
    await pool.request()
      .input('fee_id', sql.Int, fee_id)
      .input('amount_paid', sql.Decimal, amount_paid)
      .input('payment_date', sql.Date, payment_date)
    .query(`
  INSERT INTO Payments (fee_id, amount_paid, payment_date)
  VALUES (@fee_id, @amount_paid, @payment_date);
  UPDATE Fees SET status = 'Paid' WHERE fee_id = @fee_id;
`);
  }
};

module.exports = Fee;
