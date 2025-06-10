import React, { useState, useEffect, useRef } from 'react';
import { Play, Download, Copy, Sun, Moon, Code2, XCircle } from 'lucide-react';
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
  const codeRef = useRef(null);
  const lineRef = useRef(null);

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
        </div>
        <div className="toolbar-group">
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
      </div>

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
