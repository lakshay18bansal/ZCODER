import React, { useState, useEffect, useRef } from 'react';
import { fetchQuestions } from '../../utils/questions';
import { Play, Download, Copy, Sun, Moon, Code2, XCircle, User, LogOut } from 'lucide-react';
import './Editor.css';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: <Code2 size={16} /> },
  { value: 'python', label: 'Python', icon: <Code2 size={16} /> },
  { value: 'java', label: 'Java', icon: <Code2 size={16} /> },
  { value: 'cpp', label: 'C++', icon: <Code2 size={16} /> },
  { value: 'c', label: 'C', icon: <Code2 size={16} /> },
];

const THEMES = [
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
];

const Editor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(16);
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQid, setSelectedQid] = useState('');  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const codeRef = useRef(null);
  const lineRef = useRef(null);// Load questions and set from query param if present
  useEffect(() => {
    fetchQuestions().then(qs => {
      setQuestions(qs);
      const params = new URLSearchParams(window.location.search);
      const qid = params.get('qid');
      if (qid) {
        setSelectedQid(qid);
        const q = qs.find(q => q.id === qid);
        setSelectedQuestion(q || null);
      }
    });
  }, []);
  // Check if user is logged in and get username
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (selectedQid && questions.length) {
      const q = questions.find(q => q.id === selectedQid);
      setSelectedQuestion(q || null);
    }
  }, [selectedQid, questions]);
  // ...existing code...
  // Add question selector

  // line numbers
  const getLineNumbers = () => {
    return code.split('\n').map((_, i) => i + 1).join('\n');
  };

  // scroll sync
  const handleScroll = () => {
    if (lineRef.current && codeRef.current) {
      lineRef.current.scrollTop = codeRef.current.scrollTop;
    }
  };

  // copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
  };

  // download code
  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : 'js';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // run code
  const onRunCode = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // get stored userId

    const response = await fetch('http://localhost:5000/api/code/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        language,
        code,
        input,
        userId,
        questionId: selectedQid,
      }),
    });

    const data = await response.json();
    setOutput(data.output || data.error || 'No output');
  } catch (error) {
    setOutput('Error connecting to server');
    console.error(error);
  }
};

  // clear output
  const onClearOutput = () => {
    setOutput('');
  };
  // handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  // get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (isCopied) {
      const t = setTimeout(() => setIsCopied(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isCopied]);

  return (
    <div className={`editor-glass editor-theme-${theme}`}>
      <div className="editor-glow" />
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <select className="editor-select" value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <select className="editor-select" value={theme} onChange={e => setTheme(e.target.value)}>
            {THEMES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-group">
          <input type="range" min={12} max={22} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="font-slider" />
          <span className="font-size-label">{fontSize}px</span>
        </div>        <div className="toolbar-group">
          <select
            className="editor-select"
            value={selectedQid}
            onChange={e => setSelectedQid(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <option value="">Choose Question</option>
            {questions.map(q => (
              <option key={q._id} value={q._id}>{q.id} - {q.question.slice(0, 30)}...</option>
            ))}
          </select>
          <button className="icon-btn" onClick={handleCopy} title="Copy Code">
            <Copy size={18} />
            {isCopied && <span className="copied-badge">Copied!</span>}
          </button>
          <button className="icon-btn" onClick={handleDownload} title="Download Code">
            <Download size={18} />
          </button>
          <button className="icon-btn run-btn" onClick={onRunCode} title="Run Code">
            <Play size={18} />
          </button>
        </div>
          {isLoggedIn && (
          <div className="toolbar-group user-profile-section">
            <div className="user-profile">
              <div className="user-avatar">
                {getUserInitials(username)}
              </div>
              <span className="username-text">{username}</span>
            </div>
            <button className="icon-btn signout-btn" onClick={handleSignOut} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div style={{ background: '#23272f', color: '#b2f5ea', borderRadius: 8, padding: 12, margin: '12px 0' }}>
          <div><strong>Question {selectedQuestion.id}:</strong> {selectedQuestion.question}</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            <strong>Input:</strong> {selectedQuestion.input_format} | <strong>Output:</strong> {selectedQuestion.output_format}
          </div>
        </div>
      )}

      <div className="editor-main">
        <div className="editor-code-area">
          <textarea
            className="editor-lines"
            ref={lineRef}
            value={getLineNumbers()}
            readOnly
            style={{ fontSize: fontSize, color: theme === 'light' ? '#38b2ac' : '#63b3ed' }}
          />
          <textarea
            className="editor-code"
            ref={codeRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onScroll={handleScroll}
            style={{ fontSize: fontSize }}
            spellCheck={false}
            placeholder={"// Start your code journey here..."}
          />
        </div>

        <div className="editor-output-area">
          <div className="output-header">
            <span className="output-title">Input (stdin)</span>
          </div>
          <textarea
            className="editor-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Optional input (e.g., for scanf, cin, input())"
            style={{ fontSize: 14, minHeight: 60 }}
          />

          <div className="output-header" style={{ marginTop: 16 }}>
            <span className="output-title">Output</span>
            <button className="icon-btn clear-btn" onClick={onClearOutput} title="Clear Output">
              <XCircle size={16} />
            </button>
          </div>

          <div className="output-content">
            {output ? (
              <pre className="output-bubble">{output}</pre>
            ) : (
              <div className="output-placeholder">
                <Play size={20} />
                <span>Run your code to see output!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
