const Visitor = require('../models/visitorModel');

exports.getAllVisitors = async (req, res) => {
  try { res.json(await Visitor.getAllVisitors()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.addVisitor = async (req, res) => {
  try {
    const { student_id, visitor_name, entry_time } = req.body; // removed exit_time, logged on exit
    await Visitor.addVisitor(student_id, visitor_name, entry_time);
    res.status(201).json({ message: 'Visitor logged successfully' });
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
