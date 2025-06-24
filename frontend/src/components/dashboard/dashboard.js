import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import './dashboard.css';
import { fetchQuestions } from '../../utils/questions';


const Dashboard = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [filterTag, setFilterTag] = useState('');
  const [search, setSearch] = useState('');
  const [solvedCount, setSolvedCount] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(null);
  const fetchBookmarks = async (uid) => {
  try {
    const res = await fetch(`https://zcoder-backend-b6ii.onrender.com/api/bookmarks/${uid}`);
    const data = await res.json();
    setBookmarkedQuestions(new Set(data.bookmarks.map(q => q._id)));
  } catch (err) {
    console.error('Failed to fetch bookmarks:', err);
  }
};

  const fetchDashboardMetrics = async (userId) => {
  const res = await fetch(`https://zcoder-backend-b6ii.onrender.com/api/code/metrics/${userId}`); // Updated to absolute URL for dev
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
};
  useEffect(() => {
  const uid = localStorage.getItem('userId');
  if (!uid) return;

  const fetchAllData = async () => {
    try {
      const metrics = await fetchDashboardMetrics(uid);
      console.log("✅ Metrics received:", metrics);
      setSolvedCount(metrics.solved);
      setSubmissionCount(metrics.submissions);

      // ✅ accurate bookmarks (from /api/bookmarks)
      const res = await fetch(`https://zcoder-backend-b6ii.onrender.com/api/bookmarks/${uid}`);
      const data = await res.json();
      setBookmarkedQuestions(new Set(data.bookmarks.map(q => q._id))); // use _id for Mongo refs
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    }
  };

  fetchAllData();
    console.log("🧪 Calling fetchQuestions() from Dashboard...");
  fetchQuestions().then(setQuestions);
}, []);



  const toggleBookmark = async (qid) => {
  const uid = localStorage.getItem('userId');
  if (!uid) return;

  try {
    const res = await fetch('https://zcoder-backend-b6ii.onrender.com/api/bookmarks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, questionId: qid }),
    });

    const data = await res.json();
    if (data.success) {
      // fetchBookmarks again to sync state from DB
      await fetchBookmarks(uid);
    }
  } catch (err) {
    console.error('Bookmark toggle failed:', err);
  }
};



  const allTags = Array.from(
    new Set(questions.flatMap(q => q.tags.concat(q.difficulty ? [q.difficulty] : [])))
  );

  const filteredQuestions = questions.filter(q =>
    (!filterTag || q.tags.includes(filterTag) || q.difficulty === filterTag) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()))
  );

  const QuestionCard = ({ question }) => (
    <div
      className={`problem-card ${selectedQuestion?.id === question.id ? 'border-teal-400' : ''}`}
      onClick={() => setSelectedQuestion(question)}
    >
      <div className="problem-card-header">
        <h3>Q: {question.id}</h3>
        <span
          onClick={e => { e.stopPropagation(); toggleBookmark(question._id); }}
          style={{ cursor: 'pointer', fontSize: 22, color: bookmarkedQuestions.has(question._id) ? '#ecc94b' : '#b2f5ea' }}
        >
          {bookmarkedQuestions.has(question._id) ? '★' : '☆'}
        </span>
      </div>
      <p className="problem-card-title">{question.question}</p>
      <div className="tags">
        {question.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        {question.difficulty && (
          <span className={`tag difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div style={{ padding: '0px 20px 32px', background: '#1f2937', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '32px' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#38b2ac', margin: 0 }}>Dashboard · ZCODER</h1>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="stat-card"><h4>Total Questions</h4><p>{questions.length}</p></div>
            <div className="stat-card"><h4>Solved</h4><p>{solvedCount > 0 ? solvedCount : '--'}</p></div>
            <div className="stat-card"><h4>Submissions</h4><p>{submissionCount > 0 ? submissionCount : '--'}</p></div>
            <div className="stat-card"><h4>Bookmarked</h4><p>{bookmarkedQuestions.size > 0 ? bookmarkedQuestions.size : '--'}</p></div>
          </div>
        </div>
        <p style={{ fontStyle: 'italic', fontSize: '1.3rem', color: '#b2f5ea', marginTop: '12px', marginBottom: '12px' }}>
          Welcome back, coder! Keep your streak strong and your logic sharper.
        </p>
        <p style={{ fontSize: '1.1rem', color: '#c4f1f9', lineHeight: 1.6, maxWidth: '960px', marginBottom: '16px', fontWeight: '500' }}>
          Your journey to becoming a code ninja starts here. Dive into handpicked problems, flex your brain, and build that muscle memory for patterns. This isn’t just another platform—it’s your personal battleground of bugs and brilliance.
        </p>
      </div>
      <div style={{ background: '#1e2a36', borderRadius: '12px', padding: '24px', marginTop: '2px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <h3 style={{ color: '#38b2ac', fontSize: '20px', marginBottom: '12px', marginTop: '24px' }}>Pro Tips 🧠</h3>
        <ul style={{ color: '#e6fffa', fontSize: '16px', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
          <li><strong>🔥 Filter wisely:</strong> Master one tag at a time. Today trees, tomorrow DP.</li>
          <li><strong>📚 Bookmark the beasts:</strong> Found a tough nut? Mark it, crack it later.</li>
          <li><strong>🛠️ Build patterns:</strong> Repetition isn’t boring—it’s brain gains.</li>
          <li><strong>🧪 Debug like a scientist:</strong> Hypothesize, test, iterate. Your console is your lab.</li>
          <li><strong>⚡ Speed comes later:</strong> First get it right. Then get it fast.</li>
        </ul>
      </div>
      <div className="dashboard-section" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24 }}>
        <div style={{ flex: 1, minWidth: 320, maxHeight: 600, overflowY: 'auto', borderRight: '1px solid #23272f', paddingRight: 16 }}>
          <h3 style={{ color: '#38b2ac', marginBottom: 12 }}>Questions</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search by title or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 2, borderRadius: '8px', border: '1px solid #38b2ac', padding: '10px 14px', background: '#1a202c', color: '#e6fffa', fontSize: '15px', outline: 'none', transition: 'border 0.2s' }}
            />
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              style={{ flex: 1, borderRadius: '8px', border: '1px solid #38b2ac', padding: '10px 12px', background: '#1a202c', color: '#e6fffa', fontSize: '15px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (<option key={tag} value={tag}>{tag}</option>))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredQuestions.map(q => (<QuestionCard key={q.id} question={q} />))}
            {filteredQuestions.length === 0 && <div style={{ color: '#b2f5ea', textAlign: 'center', marginTop: 24 }}>No questions found.</div>}
          </div>
        </div>
        <div style={{ flex: 2, minWidth: 320 }}>
          {selectedQuestion ? (
            <div className="code-editor-container">
              <h3 style={{ color: '#b2f5ea', fontWeight: 600, fontSize: 20, marginTop: 0, marginBottom: 16 }}>Q: {selectedQuestion.id}</h3>
              <div style={{ color: '#b2f5ea', marginBottom: 16, fontSize: 16 }}>{selectedQuestion.question}</div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Tags:</strong> {selectedQuestion.tags.join(', ')}
                {selectedQuestion.difficulty && (
                  <span className={`tag difficulty-tag difficulty-${selectedQuestion.difficulty.toLowerCase()}`} style={{ marginLeft: 8 }}>
                    {selectedQuestion.difficulty}
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 10 }}><strong style={{ color: '#38b2ac' }}>Constraints:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.constraints}</span></div>
              <div style={{ marginBottom: 10 }}><strong style={{ color: '#38b2ac' }}>Input Format:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.input_format}</span></div>
              <div style={{ marginBottom: 10 }}><strong style={{ color: '#38b2ac' }}>Output Format:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.output_format}</span></div>
              <div style={{ marginBottom: 10 }}><strong style={{ color: '#38b2ac' }}>Sample Input:</strong><pre style={{ background: '#23272f', color: '#b2f5ea', borderRadius: 6, padding: 8, margin: 0 }}>{selectedQuestion.demo_input}</pre></div>
              <div style={{ marginBottom: 18 }}><strong style={{ color: '#38b2ac' }}>Sample Output:</strong><pre style={{ background: '#23272f', color: '#b2f5ea', borderRadius: 6, padding: 8, margin: 0 }}>{selectedQuestion.demo_output}</pre></div>
              <button className="action-button primary-button" style={{ marginTop: 16 }} onClick={() => window.location.href = `/editor?qid=${selectedQuestion.id}`}>
                Go to Editor & Solve
              </button>
            </div>
          ) : (
            <div style={{ color: '#b2f5ea', textAlign: 'center', padding: 32 }}>
              <Code size={48} style={{ color: '#23272f', marginBottom: 12 }} />
              <h3 style={{ fontWeight: 600, fontSize: 18 }}>Select a Question</h3>
              <p>Choose a question from the left panel to view details and start solving</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
