import React, { useState } from 'react';
import { Code, Play, Save, Star } from 'lucide-react';
import './dashboard.css';

const Dashboard = () => {
  const [code, setCode] = useState('// Welcome to ZCODER!\n// Start coding your solution here\n\nfunction solve() {\n    // Your code here\n    return "Hello World!";\n}\n\nsolve();');
  const [output, setOutput] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookmarkedProblems, setBookmarkedProblems] = useState(new Set());

  const problems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      solved: true
    },
    {
      id: 2,
      title: 'Binary Tree Traversal',
      difficulty: 'Medium',
      tags: ['Tree', 'DFS'],
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
      solved: false
    },
    {
      id: 3,
      title: 'Longest Substring',
      difficulty: 'Hard',
      tags: ['String', 'Sliding Window'],
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      solved: false
    }
  ];

  const handleRunCode = () => {
    setOutput('Running code...\n\nOutput:\nHello World!\n\nExecution completed successfully ✓');
  };

  const toggleBookmark = (problemId) => {
    const newBookmarks = new Set(bookmarkedProblems);
    if (newBookmarks.has(problemId)) {
      newBookmarks.delete(problemId);
    } else {
      newBookmarks.add(problemId);
    }
    setBookmarkedProblems(newBookmarks);
  };
  const ProblemCard = ({ problem }) => (
    <div className={`problem-card ${selectedProblem?.id === problem.id ? 'border-teal-400' : ''}`}
    onClick={() => setSelectedProblem(problem)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <h3 style={{ color: '#b2f5ea', fontWeight: 600, margin: 0 }}>{problem.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`difficulty-tag difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <button 
            onClick={e => { e.stopPropagation(); toggleBookmark(problem.id); }}
            style={{ background: 'none', border: 'none', color: bookmarkedProblems.has(problem.id) ? '#ecc94b' : '#b2f5ea', cursor: 'pointer' }}
          >
            <Star size={16} fill={bookmarkedProblems.has(problem.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p style={{ color: '#b2f5ea', fontSize: 14, marginBottom: 12 }}>{problem.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {problem.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      {problem.solved && (
        <div style={{ marginTop: 10, color: '#38b2ac', fontSize: 13, fontWeight: 500 }}>✓ Solved</div>
      )}
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
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3 style={{ color: '#38b2ac', marginBottom: 12 }}>Coding Problems</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {problems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
        <div style={{ flex: 2, minWidth: 320 }}>          {selectedProblem ? (
            <div className="code-editor-container">
              <h3 style={{ color: '#b2f5ea', fontWeight: 600, fontSize: 20, marginTop: 0, marginBottom: 16 }}>{selectedProblem.title}</h3>
              <p style={{ color: '#b2f5ea', marginBottom: 20 }}>{selectedProblem.description}</p>
              <textarea
                className="code-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="// Write your solution here..."
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleRunCode} className="action-button primary-button">
                  <Play size={16} /> Run Code
                </button>
                <button className="action-button secondary-button">
                  <Save size={16} /> Save
                </button>
              </div>
              <div className="output-container">
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Output</div>
                <pre style={{ margin: 0 }}>{output || 'Click "Run Code" to see output...'}</pre>
              </div>
            </div>
          ) : (
            <div style={{ color: '#b2f5ea', textAlign: 'center', padding: 32 }}>
              <Code size={48} style={{ color: '#23272f', marginBottom: 12 }} />
              <h3 style={{ fontWeight: 600, fontSize: 18 }}>Select a Problem</h3>
              <p>Choose a coding problem from the left panel to start solving</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;