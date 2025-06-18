import axios from 'axios';

export async function fetchQuestions() {
  const response = await axios.get('http://localhost:5000/api/questions');
  return response.data;
}
