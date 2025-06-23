import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setError('Please log in to view submissions');
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://zcoder-backend-b6ii.onrender.com/api/code/submissions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSubmissions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch submissions');
      setLoading(false);
      console.error('Error fetching submissions:', err);
    }
  };
  const getStatusColor = (submission) => {
    // Check if submission has passed field from problem submission
    if (submission.passed === true) return '#00a650'; // Green for accepted
    if (submission.passed === false) return '#ff3333'; // Red for wrong answer
    
    // Fallback to statusCode for execution-only submissions
    if (submission.statusCode === '200') return '#00a650'; // Green for successful execution
    if (submission.statusCode === '400' || submission.statusCode === '401') return '#ff3333'; // Red for runtime error
    return '#ff9900'; // Orange for other statuses
  };

  const getStatusText = (submission) => {
    // Check if submission has passed field from problem submission
    if (submission.passed === true) return 'Accepted';
    if (submission.passed === false) return 'Wrong Answer';
    
    // Fallback to statusCode for execution-only submissions
    if (submission.statusCode === '200') return 'Executed';
    if (submission.statusCode === '400') return 'Runtime Error';
    if (submission.statusCode === '401') return 'Compilation Error';
    return 'Unknown';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatMemory = (memory) => {
    if (!memory) return 'N/A';
    const kb = parseInt(memory);
    if (kb >= 1024) {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
    return `${kb} KB`;
  };

  const formatTime = (cpuTime) => {
    if (!cpuTime) return 'N/A';
    return `${cpuTime} ms`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#00a650';
      case 'medium': return '#ff9900';
      case 'hard': return '#ff3333';
      default: return '#666';
    }
  };

  const openSubmissionModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submissions-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h1>My Submissions</h1>
        <div className="submissions-stats">
          <span className="total-submissions">Total: {submissions.length}</span>          <span className="accepted-count">
            Accepted: {submissions.filter(s => s.passed === true || (s.passed === undefined && s.statusCode === '200')).length}
          </span>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">
          <p>No submissions found. Start solving problems to see your submissions here!</p>
        </div>
      ) : (
        <div className="submissions-table-container">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Language</th>
                <th>Status</th>
                <th>Time</th>
                <th>Memory</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission._id} className="submission-row">
                  <td className="problem-cell">
                    <div className="problem-info">
                      <span className="problem-title">
                        {submission.questionId?.question || 'Unknown Problem'}
                      </span>
                      <div className="problem-meta">
                        <span 
                          className="difficulty"
                          style={{ color: getDifficultyColor(submission.questionId?.difficulty) }}
                        >
                          {submission.questionId?.difficulty || 'N/A'}
                        </span>
                        {submission.questionId?.tags && (
                          <div className="tags">
                            {submission.questionId.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="language-cell">
                    <span className={`language-badge ${submission.language}`}>
                      {submission.language.toUpperCase()}
                    </span>
                  </td>                  <td className="status-cell">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(submission),
                        color: 'white'
                      }}
                    >
                      {getStatusText(submission)}
                    </span>
                  </td>
                  <td className="time-cell">{formatTime(submission.cpuTime)}</td>
                  <td className="memory-cell">{formatMemory(submission.memory)}</td>
                  <td className="date-cell">{formatDateTime(submission.createdAt)}</td>
                  <td className="action-cell">
                    <button 
                      className="view-code-btn"
                      onClick={() => openSubmissionModal(submission)}
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing submission code */}
      {showModal && selectedSubmission && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submission Details</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="submission-info">
                <div className="info-row">
                  <span className="info-label">Problem:</span>
                  <span className="info-value">
                    {selectedSubmission.questionId?.question || 'Unknown Problem'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Language:</span>
                  <span className="info-value">{selectedSubmission.language}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>                  <span 
                    className="info-value status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(selectedSubmission),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {getStatusText(selectedSubmission)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Submitted:</span>
                  <span className="info-value">{formatDateTime(selectedSubmission.createdAt)}</span>
                </div>
              </div>
              <div className="code-section">
                <h4>Code:</h4>
                <pre className="code-block">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>              {selectedSubmission.output && (
                <div className="output-section">
                  <h4>Output:</h4>
                  <pre className="output-block">
                    <code>{selectedSubmission.output}</code>
                  </pre>
                </div>
              )}
              {selectedSubmission.verdicts && selectedSubmission.verdicts.length > 0 && (
                <div className="verdicts-section">
                  <h4>Test Case Results:</h4>
                  <div className="verdicts-container">
                    {selectedSubmission.verdicts.map((verdict, index) => (
                      <div key={index} className="verdict-item">
                        <h5>Test Case {index + 1}:</h5>
                        <pre className="verdict-block">
                          <code>{verdict}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
