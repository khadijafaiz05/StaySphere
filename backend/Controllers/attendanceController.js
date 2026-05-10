const Attendance = require('../models/attendanceModel');

exports.getAllLogs = async (req, res) => {
  try {
    res.json(await Attendance.getAllLogs());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentLogs = async (req, res) => {
  try {
    res.json(await Attendance.getLogsByStudent(req.params.studentId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const record = await Attendance.logEntry(req.body.student_id);
    res.json({ log_id: record.log_id, message: 'Check-in recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    await Attendance.logExit(req.params.logId);
    res.json({ message: 'Check-out recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
