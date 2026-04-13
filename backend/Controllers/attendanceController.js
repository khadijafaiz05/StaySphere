const Attendance = require('../models/attendanceModel');

exports.getAllLogs = async (req, res) => {
  try { res.json(await Attendance.getAllLogs()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.logEntry = async (req, res) => {
  try {
    const { student_id, entry_time } = req.body; // removed exit_time
    await Attendance.logEntry(student_id, entry_time);
    res.status(201).json({ message: 'Entry logged' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.logExit = async (req, res) => {
  try {
    const { exit_time } = req.body;
    await Attendance.logExit(req.params.id, exit_time);
    res.json({ message: 'Exit logged' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};