
import React, { useState, useEffect } from 'react';
import { Code, Play, Save, Star, Filter } from 'lucide-react';
import './dashboard.css';
import { fetchQuestions } from '../../utils/questions';

const Dashboard = () => {

  const [code, setCode] = useState('// Welcome to ZCODER!\n// Start coding your solution here\n\nfunction solve() {\n    // Your code here\n    return "Hello World!";\n}\n\nsolve();');
  const [output, setOutput] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [filterTag, setFilterTag] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuestions().then(setQuestions);
  }, []);

  const handleRunCode = () => {
    setOutput('Running code...\n\nOutput:\nHello World!\n\nExecution completed successfully ✓');
  };

  const toggleBookmark = (qid) => {
    const newBookmarks = new Set(bookmarkedQuestions);
    if (newBookmarks.has(qid)) {
      newBookmarks.delete(qid);
    } else {
      newBookmarks.add(qid);
    }
    setBookmarkedQuestions(newBookmarks);
  };

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags.concat(q.difficulty ? [q.difficulty] : []))));

  const filteredQuestions = questions.filter(q =>
    (!filterTag || q.tags.includes(filterTag) || q.difficulty === filterTag) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()))
  );

  const QuestionCard = ({ question }) => (
    <div className={`problem-card ${selectedQuestion?.id === question.id ? 'border-teal-400' : ''}`}
      onClick={() => setSelectedQuestion(question)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <h3 style={{ color: '#b2f5ea', fontWeight: 600, margin: 0 }}>Q: {question.id}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={e => { e.stopPropagation(); toggleBookmark(question.id); }}
            style={{ background: 'none', border: 'none', color: bookmarkedQuestions.has(question.id) ? '#ecc94b' : '#b2f5ea', cursor: 'pointer' }}
          >
            <Star size={16} fill={bookmarkedQuestions.has(question.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p style={{ color: '#b2f5ea', fontSize: 14, marginBottom: 12 }}>{question.question}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {question.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        {question.difficulty && (
          <span className={`tag difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
        )}
      </div>
    </div>
  );
  return (
    <div className="dashboard-container">
      <h2>Welcome to ZCoder Dashboard</h2>
      <div className="dashboard-section">
        <h3 style={{ color: '#38b2ac', marginBottom: 16, fontSize: 20 }}>Platform Features</h3>
        <ul>
          <li><strong>Personalized Profiles:</strong> Build your unique coding identity and connect with peers.</li>
          <li><strong>Collaborative Learning:</strong> Share solutions, give feedback, and learn from others.</li>
          <li><strong>Efficient Practice:</strong> Streamline coding practice with accessible tools and saved resources.</li>
        </ul>
        <p>More features coming soon...</p>
      </div>
      <div className="dashboard-section" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 32 }}>
        {/* Left: Scrollable Questions List with Filter */}
        <div style={{ flex: 1, minWidth: 320, maxHeight: 600, overflowY: 'auto', borderRight: '1px solid #23272f', paddingRight: 16 }}>
          <h3 style={{ color: '#38b2ac', marginBottom: 12 }}>Questions</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, borderRadius: 6, border: '1px solid #38b2ac', padding: '4px 8px', background: '#23272f', color: '#b2f5ea' }}
            />
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              style={{ borderRadius: 6, border: '1px solid #38b2ac', background: '#23272f', color: '#b2f5ea', padding: '4px 8px' }}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredQuestions.map(q => (
              <QuestionCard key={q.id} question={q} />
            ))}
            {filteredQuestions.length === 0 && <div style={{ color: '#b2f5ea', textAlign: 'center', marginTop: 24 }}>No questions found.</div>}
          </div>
        </div>
        {/* Right: Question Details and Submit Button */}
        <div style={{ flex: 2, minWidth: 320 }}>
          {selectedQuestion ? (
            <div className="code-editor-container">
              <h3 style={{ color: '#b2f5ea', fontWeight: 600, fontSize: 20, marginTop: 0, marginBottom: 16 }}>Q: {selectedQuestion.id}</h3>
              <div style={{ color: '#b2f5ea', marginBottom: 16, fontSize: 16 }}>{selectedQuestion.question}</div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Tags:</strong> {selectedQuestion.tags.join(', ')}
                {selectedQuestion.difficulty && (
                  <span className={`tag difficulty-tag difficulty-${selectedQuestion.difficulty.toLowerCase()}`} style={{ marginLeft: 8 }}>{selectedQuestion.difficulty}</span>
                )}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Constraints:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.constraints}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Input Format:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.input_format}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Output Format:</strong> <span style={{ color: '#b2f5ea' }}>{selectedQuestion.output_format}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#38b2ac' }}>Sample Input:</strong>
                <pre style={{ background: '#23272f', color: '#b2f5ea', borderRadius: 6, padding: 8, margin: 0 }}>{selectedQuestion.demo_input}</pre>
              </div>
              <div style={{ marginBottom: 18 }}>
                <strong style={{ color: '#38b2ac' }}>Sample Output:</strong>
                <pre style={{ background: '#23272f', color: '#b2f5ea', borderRadius: 6, padding: 8, margin: 0 }}>{selectedQuestion.demo_output}</pre>
              </div>
              <button
                className="action-button primary-button"
                style={{ marginTop: 16 }}
                onClick={() => window.location.href = `/editor?qid=${selectedQuestion.id}`}
              >
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