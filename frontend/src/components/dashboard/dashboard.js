import React, { useState } from 'react';
import { Users, Code, BookOpen, BarChart3, Search, Play, Save, Share2, MessageCircle, Star } from 'lucide-react';
import './dashboard.css';

const ZCoderDashboard = () => {
  const [activeTab, setActiveTab] = useState('problems');
  const [code, setCode] = useState('// Welcome to ZCODER!\n// Start coding your solution here\n\nfunction solve() {\n    // Your code here\n    return "Hello World!";\n}\n\nsolve();');
  const [output, setOutput] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookmarkedProblems, setBookmarkedProblems] = useState(new Set());
  const [chatMessages, setChatMessages] = useState([
    { user: 'Alice', message: 'Anyone working on the binary tree problem?', time: '2:30 PM' },
    { user: 'Bob', message: 'Yes! I\'m stuck on the recursive approach', time: '2:32 PM' },
    { user: 'You', message: 'I can help! Let me share my solution', time: '2:35 PM' }
  ]);

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
    <div className={`dashboard-section p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
      selectedProblem?.id === problem.id ? 'border-teal-400 bg-[#23272f]' : 'border-gray-700 hover:border-teal-400 bg-[#181a20]'
    }`}
    onClick={() => setSelectedProblem(problem)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
        <h3 style={{ color: '#b2f5ea', fontWeight: 600 }}>{problem.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 8, background: problem.difficulty === 'Easy' ? '#38b2ac22' : problem.difficulty === 'Medium' ? '#ecc94b22' : '#e53e3e22', color: problem.difficulty === 'Easy' ? '#38b2ac' : problem.difficulty === 'Medium' ? '#ecc94b' : '#e53e3e' }}>{problem.difficulty}</span>
          <button 
            onClick={e => { e.stopPropagation(); toggleBookmark(problem.id); }}
            style={{ background: 'none', border: 'none', color: bookmarkedProblems.has(problem.id) ? '#ecc94b' : '#b2f5ea', cursor: 'pointer' }}
          >
            <Star size={16} fill={bookmarkedProblems.has(problem.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p style={{ color: '#b2f5ea', fontSize: 14, marginBottom: 8 }}>{problem.description}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {problem.tags.map(tag => (
          <span key={tag} style={{ background: '#23272f', color: '#38b2ac', borderRadius: 8, fontSize: 12, padding: '2px 10px' }}>{tag}</span>
        ))}
      </div>
      {problem.solved && (
        <div style={{ marginTop: 8, color: '#38b2ac', fontSize: 13, fontWeight: 500 }}>✓ Solved</div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2>Welcome to ZCoder Dashboard</h2>
      <div className="dashboard-section">
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
        <div style={{ flex: 2, minWidth: 320 }}>
          {selectedProblem ? (
            <div style={{ background: '#181a20', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(44,203,255,0.10)' }}>
              <h3 style={{ color: '#b2f5ea', fontWeight: 600, fontSize: 20 }}>{selectedProblem.title}</h3>
              <p style={{ color: '#b2f5ea', marginBottom: 12 }}>{selectedProblem.description}</p>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ width: '100%', minHeight: 120, background: '#23272f', color: '#b2f5ea', border: '1.5px solid #38b2ac', borderRadius: 8, padding: 12, fontFamily: 'Fira Mono, Consolas, monospace', fontSize: 15, marginBottom: 12 }}
                placeholder="// Write your solution here..."
              />
              <button onClick={handleRunCode} style={{ background: '#38b2ac', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, marginRight: 12, cursor: 'pointer' }}><Play size={16} /> Run Code</button>
              <button style={{ background: '#23272f', color: '#b2f5ea', border: '1.5px solid #38b2ac', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}><Save size={16} /> Save</button>
              <div style={{ background: '#23272f', color: '#38b2ac', borderRadius: 8, padding: 12, marginTop: 18, fontFamily: 'Fira Mono, Consolas, monospace', fontSize: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Output</div>
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

export default ZCoderDashboard;