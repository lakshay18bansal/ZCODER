const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tags: [String],
  difficulty: String,
  question: String,
  constraints: String,
  input_format: String,
  output_format: String,
  demo_input: String,
  demo_output: String,
  evaluation_inputs: [String],
  evaluation_outputs: [String],
});

module.exports = mongoose.model('Question', QuestionSchema);
