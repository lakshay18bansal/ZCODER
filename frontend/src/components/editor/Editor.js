import React, { useState, useEffect, useRef } from 'react';
import { fetchQuestions } from '../../utils/questions';
import { Play, Download, Copy, Sun, Moon, Code2, XCircle, Settings, CheckCircle, Code } from 'lucide-react';
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
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQid, setSelectedQid] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('testcase');
  const codeRef = useRef(null);
  const lineRef = useRef(null);
  // Load questions and set from query param if present
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
  useEffect(() => {
    if (selectedQid && questions.length) {
      const q = questions.find(q => q.id === selectedQid);
      setSelectedQuestion(q || null);
      
      // Set default code template based on selected question and language
      if (q) {
        const templates = {
          javascript: `function solution() {
    // Write your solution here for: ${q.question}
    
}`,
          python: `def solution():
    # Write your solution here for: ${q.question}
    pass`,
          java: `public class Solution {
    public void solution() {
        // Write your solution here for: ${q.question}
        
    }
}`,
          cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here for: ${q.question}
    
    return 0;
}`,
          c: `#include <stdio.h>

int main() {
    // Write your solution here for: ${q.question}
    
    return 0;
}`
        };
        
        setCode(templates[language] || templates.javascript);
      }
    }
  }, [selectedQid, questions, language]);
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
      const response = await fetch('http://localhost:5000/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input }),
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

  // reset code to template
  const onResetCode = () => {
    if (selectedQuestion) {
      const templates = {
        javascript: `function solution() {
    // Write your solution here for: ${selectedQuestion.question}
    
}`,
        python: `def solution():
    # Write your solution here for: ${selectedQuestion.question}
    pass`,
        java: `public class Solution {
    public void solution() {
        // Write your solution here for: ${selectedQuestion.question}
        
    }
}`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here for: ${selectedQuestion.question}
    
    return 0;
}`,
        c: `#include <stdio.h>

int main() {
    // Write your solution here for: ${selectedQuestion.question}
    
    return 0;
}`
      };
      
      setCode(templates[language] || templates.javascript);
    }
    setOutput('');
  };

  useEffect(() => {
    if (isCopied) {
      const t = setTimeout(() => setIsCopied(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isCopied]);
  return (
    <div className={`editor-container editor-theme-${theme}`}>
      {/* Header with navigation and tools */}
      <div className="editor-header">
        <div className="problem-nav">
          <button 
            className="nav-button" 
            onClick={() => window.history.back()}
            title="Back to Dashboard"
          >
            ← Back
          </button>
          <select
            className="question-select"
            value={selectedQid}
            onChange={e => setSelectedQid(e.target.value)}
          >
            <option value="">Choose Question</option>
            {questions.map(q => (
              <option key={q.id} value={q.id}>{q.id}. {q.question}</option>
            ))}
          </select>
        </div>
        
        <div className="editor-controls">
          <select className="control-select" value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <button className="icon-btn" onClick={handleCopy} title="Copy Code">
            <Copy size={16} />
            {isCopied && <span className="copied-badge">Copied!</span>}
          </button>
          <button className="icon-btn run-btn" onClick={onRunCode} title="Run Code">
            <Play size={16} />
            Run
          </button>
        </div>
      </div>

      {/* Main split layout */}
      <div className="editor-split">
        {/* Problem Description Panel */}
        <div className="problem-panel">
          {selectedQuestion ? (
            <div className="problem-content">
              <div className="problem-header">
                <h1 className="problem-title">
                  {selectedQuestion.id}. {selectedQuestion.question}
                </h1>
                <div className="problem-meta">
                  <span className={`difficulty-badge difficulty-${selectedQuestion.difficulty?.toLowerCase() || 'easy'}`}>
                    {selectedQuestion.difficulty || 'Easy'}
                  </span>
                  {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                    <div className="problem-tags">
                      {selectedQuestion.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-badge">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="problem-description">
                <div className="section">
                  <h3>Problem Statement</h3>
                  <p>{selectedQuestion.question}</p>
                </div>

                {selectedQuestion.input_format && (
                  <div className="section">
                    <h3>Input Format</h3>
                    <p>{selectedQuestion.input_format}</p>
                  </div>
                )}

                {selectedQuestion.output_format && (
                  <div className="section">
                    <h3>Output Format</h3>
                    <p>{selectedQuestion.output_format}</p>
                  </div>
                )}

                {selectedQuestion.sample_input && selectedQuestion.sample_output && (
                  <div className="section">
                    <h3>Example</h3>
                    <div className="example">
                      <div className="example-item">
                        <strong>Input:</strong>
                        <pre className="example-code">{selectedQuestion.sample_input}</pre>
                      </div>
                      <div className="example-item">
                        <strong>Output:</strong>
                        <pre className="example-code">{selectedQuestion.sample_output}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab navigation */}
              <div className="problem-tabs">
                <button 
                  className={`tab ${activeTab === 'testcase' ? 'active' : ''}`}
                  onClick={() => setActiveTab('testcase')}
                >
                  Testcase
                </button>
                <button 
                  className={`tab ${activeTab === 'result' ? 'active' : ''}`}
                  onClick={() => setActiveTab('result')}
                >
                  Result
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'testcase' && (
                  <div className="testcase-panel">
                    <div className="input-section">
                      <label>Custom Input:</label>
                      <textarea
                        className="input-textarea"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Enter your test input here..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'result' && (
                  <div className="result-panel">
                    {output ? (
                      <pre className="output-result">{output}</pre>
                    ) : (
                      <div className="no-result">
                        <Play size={24} />
                        <span>Click "Run" to see results</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-problem">
              <Code size={48} />
              <h2>Select a Problem</h2>
              <p>Choose a question from the dropdown above to start coding</p>
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="code-panel">
          <div className="code-editor">
            <div className="editor-header-inline">
              <span className="editor-title">Code</span>
              <div className="editor-actions">
                <select className="theme-select" value={theme} onChange={e => setTheme(e.target.value)}>
                  {THEMES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <input 
                  type="range" 
                  min={12} 
                  max={20} 
                  value={fontSize} 
                  onChange={e => setFontSize(Number(e.target.value))} 
                  className="font-slider" 
                />
                <span className="font-size">{fontSize}px</span>
              </div>
            </div>

            <div className="code-area">
              <div className="line-numbers">
                <textarea
                  ref={lineRef}
                  value={getLineNumbers()}
                  readOnly
                  className="line-numbers-textarea"
                  style={{ fontSize: fontSize }}
                />
              </div>
              <textarea
                ref={codeRef}
                className="code-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                onScroll={handleScroll}
                style={{ fontSize: fontSize }}
                spellCheck={false}
                placeholder="// Write your solution here..."
              />
            </div>
          </div>

          <div className="editor-footer">
            <div className="footer-actions">
              <button className="action-btn secondary" onClick={handleDownload}>
                <Download size={16} />
                Download
              </button>              <button className="action-btn secondary" onClick={onResetCode}>
                Reset
              </button>
              <button className="action-btn primary" onClick={onRunCode}>
                <Play size={16} />
                Run Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
