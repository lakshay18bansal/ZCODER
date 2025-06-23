const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/signup', async (req, res) => {
    console.log("Incoming request body:", req.body);

    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log("User created:", newUser.username);
        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update-profile', async (req, res) => {
  const { userId, name, email, bio, skills } = req.body;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, bio, skills },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/get-profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      username: user.username,
      name: user.name || user.username,
      email: user.email || `${user.username}@zcoder.com`,
      bio: user.bio || `Hello! I'm ${user.name || user.username}, a passionate coder. I love solving challenging problems and improving my programming skills every day.`,
      skills: user.skills || ['Problem Solving'],

      solvedProblems: user.solvedProblems || 0,
      ranking: user.ranking || 1,
      streak: user.streak || 1,
      totalSubmissions: user.totalSubmissions || 0,
      successRate: user.successRate || 0,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/rankings', async (req, res) => {
  try {
    const users = await User.find({}, 'username solvedProblems streak successRate').lean();

    const scoredUsers = users.map(user => ({
      ...user,
      score: (user.solvedProblems * 10) + (user.streak * 2) + user.successRate
    }));

    scoredUsers.sort((a, b) => b.score - a.score);

    const rankings = scoredUsers.map((user, index) => ({
      username: user.username,
      ranking: index + 1,
      score: user.score
    }));

    res.json(rankings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
