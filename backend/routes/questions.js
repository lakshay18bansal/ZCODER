const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new question
router.post('/', async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
