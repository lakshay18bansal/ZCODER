import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BlogList.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        tag: '',
        author: '',
        dateRange: 'all' // all, today, week, month, year
    });
    const [allTags, setAllTags] = useState([]);
    const [allAuthors, setAllAuthors] = useState([]);
    const [showFilters, setShowFilters] = useState(false);    useEffect(() => {
        fetchBlogs(currentPage);
        fetchMetadata();
    }, [currentPage, filters]);

    const fetchMetadata = async () => {
        try {
            const response = await axios.get('https://zcoder-backend-b6ii.onrender.com/api/blogs');
            const allBlogs = response.data.blogs;
            
            // Extract unique tags
            const tags = [...new Set(allBlogs.flatMap(blog => blog.tags))].filter(Boolean);
            setAllTags(tags);
            
            // Extract unique authors
            const authors = [...new Set(allBlogs.map(blog => blog.author))];
            setAllAuthors(authors);
            
        } catch (error) {
            console.error('❌ [BLOG LIST] Error fetching metadata:', error);
        }
    };

    const fetchBlogs = async (page = 1) => {
        console.log(`📚 [BLOG LIST] Fetching blogs for page ${page} with filters:`, filters);
        setLoading(true);
        setError('');
        
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            
            if (filters.search) params.append('search', filters.search);
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.author) params.append('author', filters.author);
            if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
            
            const response = await axios.get(`https://zcoder-backend-b6ii.onrender.com/api/blogs?${params}`);
            console.log(`✅ [BLOG LIST] Received ${response.data.blogs.length} blogs`);
            console.log(`📄 [BLOG LIST] Pagination:`, response.data.pagination);
            
            setBlogs(response.data.blogs);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('❌ [BLOG LIST] Error fetching blogs:', error);
            setError('Failed to load blog posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content;
        return content.substr(0, maxLength) + '...';
    };    const handleFilterChange = (filterType, value) => {
        console.log(`🔍 [BLOG LIST] Filter changed: ${filterType} = ${value}`);
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const clearFilters = () => {
        console.log(`🧹 [BLOG LIST] Clearing all filters`);
        setFilters({
            search: '',
            tag: '',
            author: '',
            dateRange: 'all'
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        console.log(`📄 [BLOG LIST] Changing to page ${page}`);
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="blog-list-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading blog posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-list-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => fetchBlogs(currentPage)} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }    return (
        <div className="blog-list-container">
            <div className="blog-list-header">
                <div className="header-content">
                    <h1>📚 Discover Amazing Stories</h1>
                    <p className="header-subtitle">Explore thoughts, insights, and experiences from our community</p>
                </div>
                <Link to="/blogs/new" className="new-blog-btn">
                    <span className="btn-icon">✨</span>
                    Create Story
                </Link>
            </div>

            {/* Enhanced Filter Section */}
            <div className="filter-section">
                <div className="filter-toggle">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    >
                        <span className="filter-icon">🔍</span>
                        Filters & Search
                        <span className={`toggle-arrow ${showFilters ? 'up' : 'down'}`}>
                            {showFilters ? '▲' : '▼'}
                        </span>
                    </button>
                    
                    {(filters.search || filters.tag || filters.author || filters.dateRange !== 'all') && (
                        <div className="active-filters-summary">
                            <span className="active-count">
                                {[filters.search, filters.tag, filters.author, filters.dateRange !== 'all' ? filters.dateRange : null]
                                    .filter(Boolean).length} active
                            </span>
                            <button onClick={clearFilters} className="clear-all-btn">
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {showFilters && (
                    <div className="filter-panel">
                        {/* Search */}
                        <div className="filter-group">
                            <label className="filter-label">
                                <span className="label-icon">🔍</span>
                                Search in titles and content
                            </label>
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    placeholder="Search for stories, topics, keywords..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="search-input"
                                />
                                {filters.search && (
                                    <button 
                                        onClick={() => handleFilterChange('search', '')}
                                        className="clear-input-btn"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tag Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                <span className="label-icon">🏷️</span>
                                Filter by topic
                            </label>
                            <select
                                value={filters.tag}
                                onChange={(e) => handleFilterChange('tag', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All topics</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>#{tag}</option>
                                ))}
                            </select>
                        </div>

                        {/* Author Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                <span className="label-icon">👤</span>
                                Filter by author
                            </label>
                            <select
                                value={filters.author}
                                onChange={(e) => handleFilterChange('author', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All authors</option>
                                {allAuthors.map(author => (
                                    <option key={author} value={author}>{author}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                <span className="label-icon">📅</span>
                                Filter by time
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All time</option>
                                <option value="today">Today</option>
                                <option value="week">This week</option>
                                <option value="month">This month</option>
                                <option value="year">This year</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {blogs.length === 0 ? (
                <div className="no-blogs">
                    <h3>No blog posts yet</h3>
                    <p>Be the first to share your thoughts!</p>
                    <Link to="/blogs/new" className="new-blog-btn">
                        Create First Post
                    </Link>
                </div>
            ) : (
                <>                    <div className="blog-cards-grid">
                        {blogs.map(blog => (
                            <div key={blog._id} className="blog-card">
                                <div className="blog-card-gradient"></div>
                                
                                <div className="blog-card-content">
                                    <div className="blog-card-header">
                                        <h3 className="blog-title">
                                            <Link to={`/blogs/${blog._id}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>
                                        
                                        <div className="blog-content-preview">
                                            <p>{truncateContent(blog.content, 200)}</p>
                                        </div>
                                        
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="blog-tags">
                                                {blog.tags.slice(0, 4).map((tag, index) => (
                                                    <span key={index} className="blog-tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {blog.tags.length > 4 && (
                                                    <span className="more-tags">
                                                        +{blog.tags.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="blog-card-meta">
                                    <div className="blog-meta">
                                        <div className="author-section">
                                            <span className="author-avatar">👤</span>
                                            <span>{blog.author}</span>
                                        </div>
                                        <div className="blog-date">
                                            <span className="date-icon">📅</span>
                                            <span>{formatDate(blog.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="blog-card-footer">
                                        <div className="reading-time">
                                            <span className="reading-icon">⏱️</span>
                                            {Math.ceil(blog.content.length / 200)} min read
                                        </div>
                                        <Link to={`/blogs/${blog._id}`} className="read-more-btn">
                                            Read Story
                                            <span className="arrow-icon">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrev}
                                className="pagination-btn"
                            >
                                ← Previous
                            </button>
                            
                            <div className="pagination-info">
                                Page {pagination.currentPage} of {pagination.totalPages}
                                <span className="total-blogs">({pagination.totalBlogs} total posts)</span>
                            </div>
                            
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNext}
                                className="pagination-btn"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BlogList;
