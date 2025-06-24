import React, { useState, useEffect, useRef } from 'react';
import { fetchQuestions } from '../../utils/questions';
import { Play, Download, Copy, Sun, Moon, Code2, XCircle, User, LogOut } from 'lucide-react';
import './Editor.css';
import axios from "axios";
import { CheckCircle } from "react-feather";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

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
  const [showVerdictPopup, setShowVerdictPopup] = useState(false);
  const [verdictResults, setVerdictResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitVerdicts, setSubmitVerdicts] = useState([]);  
  const codeRef = useRef(null);
  const lineRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  fetchQuestions().then(qs => {
    setQuestions(qs);
    const params = new URLSearchParams(window.location.search);
    const qid = params.get('qid'); // this is question.id
    if (qid) {
      const q = qs.find(q => q.id === qid);
      if (q) {
        setSelectedQid(q._id);
        setSelectedQuestion(q);
      }
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
    const response = await fetch('https://zcoder-backend-b6ii.onrender.com/api/code/execute', {
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
    const handleSubmit = async () => {
  console.log("🔥 Submit button clicked");

  if (!isLoggedIn) {
    alert("ZCODER says:\n\nPlease login to submit solutions.");
    return;
  }

  if (!selectedQuestion) {
    alert("ZCODER says:\n\nPlease select a question before submitting.");
    return;
  }

  setIsSubmitting(true);
  setSubmitVerdicts([]);

  try {
    const res = await axios.post("https://zcoder-backend-b6ii.onrender.com/api/code/submit", {
      code,
      language,
      questionId: selectedQid,
      userId: localStorage.getItem('userId'),
    });

    setSubmitVerdicts(res.data.verdicts || []);
    if (!res.data.passed) {
      setOutput(
        res.data.verdicts
          .map(v => `Test Case ${v.testCase}: ${v.passed ? '✅ Passed' : '❌ Failed'}`)
          .join("\n")
      );
    }
  } catch (err) {
    console.error("❌ Submit error:", err?.response?.data || err.message);
    setSubmitVerdicts([{
      testCase: 0,
      passed: false,
      input: '',
      expected: '',
      output: 'Submission failed'
    }]);
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
          <button className="icon-btn submit-btn" onClick={handleSubmit} title="Submit Code">
              <CheckCircle size={18} />&nbsp;Submit
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
          <div style={{ fontSize: 13, marginTop: 2 }}>
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
            style={{ fontSize: 15, minHeight: 60 }}
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
      {isSubmitting && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Evaluating Test Cases...</h3>
      {submitVerdicts.length === 0 ? (
        <div className="loader"></div>
      ) : (
        <div className="verdict-list">
          {submitVerdicts.map((v, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>Test Case {v.testCase}:</strong> {v.passed ? '✅ Passed' : '❌ Failed'}
              <pre style={{ fontSize: 13, marginTop: 4 }}>
                Input: {v.input}
                {"\n"}Expected: {v.expected}
                {"\n"}Your Output: {v.output}
              </pre>
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={() => {
          setIsSubmitting(false);
          navigate('/submissions');
        }} 
        style={{
          marginTop: 12,
          padding: '8px 16px',
          backgroundColor: '#38b2ac',
          border: 'none',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Close & View Submissions
      </button>

    </div>
  </div>
)}
    </div>
  );
};

export default Editor;
