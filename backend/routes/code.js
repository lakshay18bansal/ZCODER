const express = require('express');
const router = express.Router();
const axios = require('axios');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
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

const runCode = async (code, language, input = "") => {
  const langConfig = languageMap[language];
  if (!langConfig) throw new Error('Unsupported language');

  const program = {
    clientId,
    clientSecret,
    script: code,
    language: langConfig.lang,
    stdin: input,
    versionIndex: langConfig.versionIndex
  };

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', program);
    return { output: response.data.output };
  } catch (err) {
    console.error("runCode error:", err.response?.data || err.message);
    return { output: "Runtime error or submission failed." };
  }
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

router.post('/submit', async (req, res) => {
  const { code, language, questionId, userId } = req.body;  
  console.log("✅ Received submission for question:", questionId);

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const verdicts = [];
  let allPassed = true;

  for (let i = 0; i < question.evaluation_inputs.length; i++) {
    const input = question.evaluation_inputs[i];
    const expected = question.evaluation_outputs[i];

    const result = await runCode(code, language, input);
    const passed = result.output.trim() === expected.trim();

    verdicts.push({
      testCase: i + 1,
      input,
      expected,
      output: result.output,
      passed
    });

    if (!passed) allPassed = false;
  }

  // Save verdicts to DB as text
  const submission = new Submission({
    code,
    language,
    userId,
    questionId,
    passed: allPassed,
    verdicts: verdicts.map(v => `Test Case ${v.testCase}: ${v.passed ? '✅ Passed' : '❌ Failed'}\nInput: ${v.input}\nExpected: ${v.expected}\nYour Output: ${v.output}`)
  });

  await submission.save();
  const user = await User.findById(userId);

  if (user) {
    // total submissions always increment
    user.totalSubmissions += 1;

    if (allPassed) {
      // Only count if the question was not solved before
      const alreadySolved = await Submission.findOne({
        userId,
        questionId,
        passed: true,
        _id: { $ne: submission._id }
      });

      if (!alreadySolved) {
        user.solvedProblems += 1;
      }
    }
      const today = new Date();
      const last = user.lastSubmissionDate;
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      if (!last || !isSameDay(last, today)) {
        if (last && isSameDay(last, yesterday)) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }

        user.lastSubmissionDate = today;
      }

      // successRate
      user.successRate = user.totalSubmissions > 0
        ? Math.round((user.solvedProblems / user.totalSubmissions) * 100)
        : 0;
    await user.save();
  }

  // Send verdicts to frontend as structured JSON
  res.json({
    passed: allPassed,
    verdicts
  });
});


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

router.get('/submissions/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await Submission.find({ userId })
      .populate('questionId', 'id question difficulty tags')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (err) {
    console.error('Fetch user submissions error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user submissions' });
  }
});

router.get('/metrics/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await Submission.find({ userId }).populate('questionId', 'id');

    const solvedSet = new Set();
    let correct = 0;

    submissions.forEach(sub => {
      if (sub.passed && sub.questionId?.id) {
        solvedSet.add(sub.questionId.id);
        correct += 1;
      }
    });

    const solved = solvedSet.size;
    const submissionsCount = submissions.length;
    const successRate = submissionsCount > 0 ? ((correct / submissionsCount) * 100).toFixed(2) : 0;

    const user = await User.findById(userId).populate('bookmarks', 'id');
    const bookmarked = user?.bookmarks?.length || 0;

    res.json({ solved, submissions: submissionsCount, successRate, bookmarked });
  } catch (err) {
    console.error('Metrics fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});


module.exports = router;
