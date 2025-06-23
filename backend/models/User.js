const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  solvedProblems: { type: Number, default: 0 },
  ranking: { type: Number, default: 1 },
  totalSubmissions: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  lastSubmissionDate: { type: Date, default: null },
  streak: { type: Number, default: 0 },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, {
  timestamps: true // ✅ Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
