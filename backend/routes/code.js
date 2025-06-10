const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const clientId = process.env.JDOODLE_CLIENT_ID;
const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

// Map frontend language values to JDoodle language and optional version index
const languageMap = {
  cpp: { lang: 'cpp', versionIndex: '5' },
  c: { lang: 'c', versionIndex: '5' },
  python: { lang: 'python3', versionIndex: '4' },
  java: { lang: 'java', versionIndex: '4' },
  javascript: { lang: 'nodejs', versionIndex: '4' },
};

router.post('/execute', async (req, res) => {
  const { language, code, input } = req.body;

  const langConfig = languageMap[language];
  if (!langConfig) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  // Prepare payload
  const program = {
    clientId,
    clientSecret,
    script: code,
    language: langConfig.lang,
    stdin: input || '',
  };

  // Include versionIndex only if it exists
  if (langConfig.versionIndex) {
    program.versionIndex = langConfig.versionIndex;
  }

  try {
    console.log('Executing with config:', program);

    const response = await axios.post('https://api.jdoodle.com/v1/execute', program);
    const { output, memory, cpuTime, statusCode, error } = response.data;

    res.json({ output, memory, cpuTime, statusCode, error });
  } catch (err) {
    console.error('Execution error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Execution failed', details: err.message });
  }
});

module.exports = router;
