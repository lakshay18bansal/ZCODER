import axios from 'axios';

export async function fetchQuestions() {
  const response = await axios.get('http://localhost:5000/api/questions');
  return response.data;
}

export async function submitQuestion(question) {
  const response = await axios.post('http://localhost:5000/api/questions', question);
  return response.data;
}
