import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../config/api';

export async function fetchQuestions() {
  const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.QUESTIONS));
  return response.data;
}
