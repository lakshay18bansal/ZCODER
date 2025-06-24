import axios from 'axios';

export async function fetchQuestions() {
  try {
    console.log("🚀 Fetching questions from backend...");
    const response = await axios.get('https://zcoder-backend-b6ii.onrender.com/api/questions');
    console.log("✅ Questions fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error while fetching questions:", error);
    return []; // return empty array to avoid crash
  }
}
