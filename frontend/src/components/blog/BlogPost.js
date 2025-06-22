import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import './BlogPost.css';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        console.log(`📖 [BLOG POST] Loading blog post: ${id}`);
        fetchBlogPost();
        getCurrentUser();
    }, [id]);

    const getCurrentUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const user = localStorage.getItem('username');
                console.log(`👤 [BLOG POST] Current user: ${user}`);
                setCurrentUser(user || '');
            } catch (error) {
                console.error('❌ [BLOG POST] Error parsing token:', error);
            }
        }
    };

    const fetchBlogPost = async () => {
        console.log(`🔍 [BLOG POST] Fetching blog details for ID: ${id}`);
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
            console.log(`✅ [BLOG POST] Blog loaded: "${response.data.title}"`);
            console.log(`💬 [BLOG POST] Comments count: ${response.data.comments.length}`);
            setBlog(response.data);
        } catch (error) {
            console.error('❌ [BLOG POST] Error fetching blog:', error);
            if (error.response?.status === 404) {
                setError('Blog post not found');
            } else {
                setError('Failed to load blog post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            return;
        }

        console.log(`🗑️ [BLOG POST] Deleting blog: ${id}`);
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(`✅ [BLOG POST] Blog deleted successfully`);
            navigate('/blogs');
        } catch (error) {
            console.error('❌ [BLOG POST] Error deleting blog:', error);
            alert('Failed to delete blog post. Please try again.');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const onCommentAdded = (newComment) => {
        console.log(`💬 [BLOG POST] New comment added by ${newComment.author}`);
        setBlog(prevBlog => ({
            ...prevBlog,
            comments: [...prevBlog.comments, newComment]
        }));
    };

    const onCommentDeleted = (commentId) => {
        console.log(`🗑️ [BLOG POST] Comment deleted: ${commentId}`);
        setBlog(prevBlog => ({
            ...prevBlog,
            comments: prevBlog.comments.filter(comment => comment._id !== commentId)
        }));
    };    if (loading) {
        return (
            <div className="blog-post-container">
                <div className="blog-post-content-wrapper">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading blog post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-post-container">
                <div className="blog-post-content-wrapper">
                    <div className="error-message">
                        <h2>❌ {error}</h2>
                        <div className="error-actions">
                            <button onClick={fetchBlogPost} className="retry-btn">
                                Try Again
                            </button>
                            <Link to="/blogs" className="back-to-blogs-btn">
                                ← Back to Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    const isAuthor = currentUser === blog.author;    return (
        <div className="blog-post-container">
            <div className="blog-post-content-wrapper">
                {/* Navigation */}
                <nav className="blog-post-nav">
                    <Link to="/blogs" className="back-link">
                        ← Back to Blogs
                    </Link>
                    {isAuthor && (
                        <div className="author-actions">
                            <Link to={`/blogs/${id}/edit`} className="edit-btn">
                                ✏️ Edit
                            </Link>
                            <button onClick={handleDelete} className="delete-btn">
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </nav>

                {/* Blog Post */}
                <article className="blog-post">
                    <header className="blog-post-header">
                        <h1 className="blog-post-title">{blog.title}</h1>
                        
                        <div className="blog-post-meta">
                            <div className="author-info">
                                <span className="author-avatar">
                                    👤
                                </span>
                                <div className="author-details">
                                    <span className="author-name">{blog.author}</span>
                                    <span className="author-badge">
                                        {isAuthor ? '✍️ Author' : '📚 Reader'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="post-dates">
                                <div className="date-item">
                                    <span className="date-label">Published:</span>
                                    <span className="date-value">{formatDate(blog.createdAt)}</span>
                                </div>
                                {blog.updatedAt !== blog.createdAt && (
                                    <div className="date-item">
                                        <span className="date-label">Updated:</span>
                                        <span className="date-value">{formatDate(blog.updatedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="blog-post-tags">
                                {blog.tags.map((tag, index) => (
                                    <span key={index} className="blog-tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    <div className="blog-post-content">
                        {blog.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="comments-section">
                    <Comments 
                        postId={id}
                        comments={blog.comments}
                        currentUser={currentUser}
                        onCommentAdded={onCommentAdded}
                        onCommentDeleted={onCommentDeleted}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
