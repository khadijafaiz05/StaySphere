const Student = require('../models/studentModel');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchStudentByName = async (req, res) => {
  try {
    const students = await Student.searchStudentByName(req.query.name);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { user_id, name, phone, address } = req.body; // removed gender
    await Student.createStudent(user_id, name, phone, address);
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await Student.updateStudent(req.params.id, name, phone, address);
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};