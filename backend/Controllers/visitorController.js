const { poolPromise } = require('../config/db');
const Visitor = require('../models/visitorModel');

exports.getStudentVisitors = async (req, res) => {
  try {
    const studentId = req.params.id;

    const data = await Visitor.getVisitorsByStudent(studentId);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.addVisitor = async (req, res) => {
  try {
    const { student_id, visitor_name, entry_time } = req.body;

    await Visitor.addVisitor(student_id, visitor_name, entry_time);

    res.status(201).json({
      message: 'Visitor logged successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};
exports.getAllVisitors = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT v.visitor_id, s.name AS student_name,
             v.visitor_name, v.entry_time, v.exit_time
      FROM Visitors v JOIN Students s ON v.student_id = s.student_id
    `);
    res.json(result.recordset);
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.recordExit = async (req, res) => {
  try {
    const { exit_time } = req.body;
    await Visitor.recordExit(req.params.id, exit_time);
    res.json({ message: 'Visitor exit recorded' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.deleteVisitor = async (req, res) => {
  try {
    await Visitor.deleteVisitor(req.params.id);
    res.json({ message: 'Visitor record deleted' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};
