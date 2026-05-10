const Leave = require('../models/leaveModel');

exports.getAllLeaves = async (req, res) => {
  try {
    res.json(await Leave.getAllLeaves());
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentLeaves = async (req, res) => {
  try {
    res.json(await Leave.getLeavesByStudent(req.params.id));
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.requestLeave = async (req, res) => {
  try {
    const { student_id, from_date, to_date } = req.body;

    await Leave.requestLeave(student_id, from_date, to_date);

    res.status(201).json({
      message: 'Leave request submitted'
    });

  } catch (error) {
    console.error('Leave Request Error:', error); 

    res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    await Leave.updateLeaveStatus(req.params.id, req.body.status);

    res.json({
      message: 'Leave status updated'
    });

  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
