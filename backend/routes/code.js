const express = require('express');
const router = express.Router();
const axios = require('axios');
const Submission = require('../models/Submission');
require('dotenv').config();

const clientId = process.env.JDOODLE_CLIENT_ID;
const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

const languageMap = {
  cpp: { lang: 'cpp', versionIndex: '5' },
  c: { lang: 'c', versionIndex: '5' },
  python: { lang: 'python3', versionIndex: '4' },
  java: { lang: 'java', versionIndex: '4' },
  javascript: { lang: 'nodejs', versionIndex: '4' },
};

router.post('/execute', async (req, res) => {
  const { language, code, input, userId, questionId } = req.body;

  const langConfig = languageMap[language];
  if (!langConfig) return res.status(400).json({ error: 'Unsupported language' });

  const program = {
    clientId,
    clientSecret,
    script: code,
    language: langConfig.lang,
    stdin: input || '',
    versionIndex: langConfig.versionIndex
  };

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', program);
    const { output, memory, cpuTime, statusCode, error } = response.data;

    await Submission.create({
      userId,
      questionId,
      code,
      language,
      input,
      output,
      cpuTime,
      memory,
      statusCode
    });

    res.json({ output, memory, cpuTime, statusCode, error });
  } catch (err) {
    console.error('Execution error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Execution failed', details: err.message });
  }
});

// NEW: Get submissions for a user (and optionally filter by question)
router.get('/submissions', async (req, res) => {
  const { userId, questionId } = req.query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (questionId) filter.questionId = questionId;

  try {
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Fetch submissions error:', err.message);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
