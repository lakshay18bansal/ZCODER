import axios from 'axios';

export async function fetchQuestions() {
  const response = await axios.get('https://zcoder-backend-b6ii.onrender.com/api/questions');
  return response.data;
}
