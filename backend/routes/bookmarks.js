const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question'); // optional, in case you want to verify questionId

// Route to toggle bookmark (add/remove)
router.post('/toggle', async (req, res) => {
  const { userId, questionId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.bookmarks.indexOf(questionId);

    if (index === -1) {
      user.bookmarks.push(questionId); // Add bookmark
    } else {
      user.bookmarks.splice(index, 1); // Remove bookmark
    }

    await user.save();

    const updated = await User.findById(userId).populate('bookmarks', 'id');

    res.json({
      success: true,
      bookmarks: updated.bookmarks.map(q => q.id) // Return updated list of question ids
    });
  } catch (err) {
    console.error('Toggle bookmark error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('bookmarks');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
});

module.exports = router;
