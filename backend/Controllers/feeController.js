const Fee = require('../models/feeModel');

exports.getAllFees = async (req, res) => {
  try { res.json(await Fee.getAllFees()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getTotalPayments = async (req, res) => {
  try { res.json(await Fee.getTotalPayments()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.addFee = async (req, res) => {
  try {
    const { student_id, amount, due_date } = req.body; // removed status, model sets 'Pending'
    await Fee.addFee(student_id, amount, due_date);
    res.status(201).json({ message: 'Fee record created' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.makePayment = async (req, res) => {
  try {
    const { fee_id, amount_paid, payment_date } = req.body;
    await Fee.makePayment(fee_id, amount_paid, payment_date);
    res.status(201).json({ message: 'Payment recorded' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};