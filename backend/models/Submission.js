const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  input: { type: String },
  output: { type: String },
  cpuTime: { type: String },
  memory: { type: String },
  statusCode: { type: String },
  passed: { type: Boolean, default: false },
  verdicts: [{ type: String }],
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('Submission', SubmissionSchema);
