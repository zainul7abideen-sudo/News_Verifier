const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/students - Get all student fact-checkers
router.get('/', (req, res) => {
  const students = db.getStudents();
  return res.status(200).json({ success: true, count: students.length, data: students });
});

// GET /api/students/:id - Get student fact-checker by ID
router.get('/:id', (req, res) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student fact-checker not found' });
  }
  return res.status(200).json({ success: true, data: student });
});

// POST /api/students - Register student fact-checker
router.post('/', (req, res) => {
  const { fullName, email, university, course, semester, student_id } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ success: false, message: 'fullName and email are required' });
  }
  const newStudent = db.addStudent({
    fullName,
    email,
    university,
    course,
    semester,
    student_id
  });
  return res.status(201).json({ success: true, message: 'Student fact-checker enrolled', data: newStudent });
});

module.exports = router;
