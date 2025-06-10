import React, { useState } from 'react';
import { submitQuestion } from '../../utils/questions';
import './SubmitQuestion.css';

const initialState = {
  id: '',
  tags: '',
  difficulty: '',
  question: '',
  constraints: '',
  input_format: '',
  output_format: '',
  demo_input: '',
  demo_output: '',
  evaluation_inputs: '',
  evaluation_outputs: '',
};

const SubmitQuestion = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
        evaluation_inputs: form.evaluation_inputs.split('\n'),
        evaluation_outputs: form.evaluation_outputs.split('\n'),
      };
      await submitQuestion(payload);
      setMessage('Question submitted!');
      setForm(initialState);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="submit-question-container">
      <h2>Submit a New Question</h2>
      <form className="submit-question-form" onSubmit={handleSubmit}>
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID (unique)" required />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" required />
        <input name="difficulty" value={form.difficulty} onChange={handleChange} placeholder="Difficulty (Easy/Medium/Hard)" required />
        <textarea name="question" value={form.question} onChange={handleChange} placeholder="Question statement" required />
        <input name="constraints" value={form.constraints} onChange={handleChange} placeholder="Constraints" required />
        <input name="input_format" value={form.input_format} onChange={handleChange} placeholder="Input format" required />
        <input name="output_format" value={form.output_format} onChange={handleChange} placeholder="Output format" required />
        <textarea name="demo_input" value={form.demo_input} onChange={handleChange} placeholder="Demo input" required />
        <textarea name="demo_output" value={form.demo_output} onChange={handleChange} placeholder="Demo output" required />
        <textarea name="evaluation_inputs" value={form.evaluation_inputs} onChange={handleChange} placeholder="Evaluation inputs (one per line)" required />
        <textarea name="evaluation_outputs" value={form.evaluation_outputs} onChange={handleChange} placeholder="Evaluation outputs (one per line)" required />
        <button type="submit">Submit</button>
      </form>
      {message && <div className="submit-message">{message}</div>}
    </div>
  );
};

export default SubmitQuestion;
