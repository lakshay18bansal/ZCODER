import React, { useState, useEffect } from 'react';
import { Code, Play, Save, Star, Filter, CheckCircle, Clock, Circle } from 'lucide-react';
import './dashboard.css';
import { fetchQuestions } from '../../utils/questions';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuestions().then((fetchedQuestions) => {
      setQuestions(fetchedQuestions);
    });
  }, []);
  const handleSolveProblem = (questionId) => {
    window.location.href = `/editor?qid=${questionId}`;
  };

  const filteredQuestions = questions.filter(q =>
    (!filterTag || q.tags?.includes(filterTag) || q.difficulty === filterTag) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()))
  );

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags || []).concat(questions.map(q => q.difficulty).filter(Boolean))));

  return (
    <div className="dashboard-intro">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ZCODER</h1>
          <p className="hero-subtitle">
            Master algorithms and data structures through hands-on coding challenges
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{questions.length}</div>
              <div className="stat-label">Problems</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Submissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem List Section */}
      <div className="problems-section">
        <div className="section-header">
          <h2>Practice Problems</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="filter-select"
            >
              <option value="">All Topics</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="problems-table">
          <div className="table-header">
            <div className="col-status">Status</div>
            <div className="col-title">Title</div>
            <div className="col-difficulty">Difficulty</div>
            <div className="col-tags">Tags</div>
            <div className="col-action">Action</div>
          </div>
          
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="table-row">
              <div className="col-status">
                <div className={`status-icon ${Math.random() > 0.7 ? 'solved' : Math.random() > 0.5 ? 'attempted' : 'unsolved'}`}>
                  {Math.random() > 0.7 ? <CheckCircle size={16} /> : 
                   Math.random() > 0.5 ? <Clock size={16} /> : <Circle size={16} />}
                </div>
              </div>
              <div className="col-title">
                <span className="problem-number">{question.id}.</span>
                <span className="problem-title">{question.question}</span>
              </div>
              <div className="col-difficulty">
                <span className={`difficulty-badge difficulty-${question.difficulty?.toLowerCase() || 'easy'}`}>
                  {question.difficulty || 'Easy'}
                </span>
              </div>
              <div className="col-tags">
                <div className="tags-container">
                  {question.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                  {question.tags?.length > 2 && (
                    <span className="tag-more">+{question.tags.length - 2}</span>
                  )}
                </div>
              </div>
              <div className="col-action">
                <button 
                  className="solve-button"
                  onClick={() => handleSolveProblem(question.id)}
                >
                  Solve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;