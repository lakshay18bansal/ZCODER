import React, { useState } from 'react';
import { Play, Download, Copy } from 'lucide-react';

const Editor = ({ code = '', setCode = () => {}, onRunCode = () => {}, output = '', language = 'javascript' }) => {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const themes = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'monokai', label: 'Monokai' }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `solution.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <select value={language} onChange={() => {}}>
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          {themes.map(theme => (
            <option key={theme.value} value={theme.value}>{theme.label}</option>
          ))}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14 }}>Font Size:</label>
          <input type="range" min="12" max="20" value={fontSize} onChange={e => setFontSize(e.target.value)} />
          <span style={{ fontSize: 14 }}>{fontSize}px</span>
        </div>
        <button onClick={handleCopyCode} title="Copy Code"><Copy size={16} /></button>
        <button onClick={handleDownloadCode} title="Download Code"><Download size={16} /></button>
        <button onClick={onRunCode} style={{ background: '#38b2ac', color: '#fff', borderRadius: 6, padding: '6px 16px', marginLeft: 8 }}><Play size={16} /> Run Code</button>
      </div>
      <div style={{ display: 'flex', marginTop: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="code-area"
            style={{ fontSize: `${fontSize}px`, minHeight: 220, width: '100%' }}
            placeholder="// Start coding here..."
            spellCheck={false}
          />
        </div>
        <div style={{ width: 320, marginLeft: 24 }}>
          <div className="editor-output">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Output</div>
            <pre style={{ margin: 0, fontSize: 14 }}>{output || 'Click "Run Code" to see output...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;