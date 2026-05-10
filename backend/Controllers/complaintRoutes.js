const Complaint = require('../models/complaintModel');

exports.getAllComplaints = async (req, res) => {
  try { res.json(await Complaint.getAllComplaints()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getPendingComplaints = async (req, res) => {
  try { res.json(await Complaint.getPendingComplaints()); }
  catch { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getStudentComplaints = async (req, res) => {
  const data = await Complaint.getByStudent(req.params.id);
  res.json(data);
};

exports.addComplaint = async (req, res) => {
  try {
    const { student_id, category, description } = req.body;
    await Complaint.addComplaint(student_id, category, description);
    res.status(201).json({ message: 'Complaint submitted' });
  } catch(err) { 
    console.error('COMPLAINT ERROR:', err); 
    res.status(500).json({ error: err.message });
  }
};


exports.resolveComplaint = async (req, res) => {
  try {
    await Complaint.resolveComplaint(req.params.id); 
    res.json({ message: 'Complaint resolved' });
  } catch { res.status(500).json({ error: 'Internal Server Error' }); }
};
