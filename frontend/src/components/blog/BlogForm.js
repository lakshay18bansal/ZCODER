import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './BlogForm.css';

const BlogForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For editing existing posts
    const isEditing = Boolean(id);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingPost, setLoadingPost] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchBlogPost();
        }
    }, [id, isEditing]);

    const fetchBlogPost = async () => {
        console.log(`📝 [BLOG FORM] Loading blog for editing: ${id}`);
        setLoadingPost(true);
        
        try {
            const response = await axios.get(`https://zcoder-backend-b6ii.onrender.com/api/blogs/${id}`);
            const blog = response.data;
            
            console.log(`✅ [BLOG FORM] Blog loaded for editing: "${blog.title}"`);
            
            // Check if user is the author
            const currentUser = localStorage.getItem('username');
            if (blog.author !== currentUser) {
                console.log(`🚫 [BLOG FORM] User ${currentUser} cannot edit ${blog.author}'s post`);
                setError('You can only edit your own blog posts.');
                return;
            }
            
            setFormData({
                title: blog.title,
                content: blog.content,
                tags: blog.tags.join(', ')
            });
        } catch (error) {
            console.error('❌ [BLOG FORM] Error loading blog for editing:', error);
            setError('Failed to load blog post for editing.');
        } finally {
            setLoadingPost(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`📝 [BLOG FORM] Field "${name}" updated (length: ${value.length})`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(`🚀 [BLOG FORM] ${isEditing ? 'Updating' : 'Creating'} blog post...`);
        console.log(`📝 [BLOG FORM] Title: "${formData.title}"`);
        console.log(`📄 [BLOG FORM] Content length: ${formData.content.length}`);
        console.log(`🏷️ [BLOG FORM] Tags: "${formData.tags}"`);
        
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required.');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create or edit blog posts.');
                return;
            }
            
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
            
            const payload = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                tags: tagsArray
            };
            
            console.log(`📦 [BLOG FORM] Payload:`, payload);
            
            let response;
            if (isEditing) {
                response = await axios.put(`https://zcoder-backend-b6ii.onrender.com/api/blogs/${id}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`✅ [BLOG FORM] Blog updated successfully`);
            } else {
                response = await axios.post('https://zcoder-backend-b6ii.onrender.com/api/blogs', payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`✅ [BLOG FORM] Blog created successfully with ID: ${response.data._id}`);
            }
            
            // Navigate to the blog post
            navigate(`/blogs/${response.data._id}`);
            
        } catch (error) {
            console.error(`❌ [BLOG FORM] Error ${isEditing ? 'updating' : 'creating'} blog:`, error);
            
            if (error.response?.status === 401) {
                setError('You must be logged in to create or edit blog posts.');
            } else if (error.response?.status === 403) {
                setError('You can only edit your own blog posts.');
            } else {
                setError(`Failed to ${isEditing ? 'update' : 'create'} blog post. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingPost) {
        return (
            <div className="blog-form-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error && isEditing) {
        return (
            <div className="blog-form-container">
                <div className="error-message">
                    <h2>❌ {error}</h2>
                    <Link to="/blogs" className="back-to-blogs-btn">
                        ← Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-form-container">
            <div className="blog-form-header">
                <Link to={isEditing ? `/blogs/${id}` : '/blogs'} className="back-link">
                    ← {isEditing ? 'Back to Post' : 'Back to Blogs'}
                </Link>
                <h1>{isEditing ? '✏️ Edit Blog Post' : '✍️ Create New Blog Post'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="blog-form">
                {error && (
                    <div className="error-alert">
                        <span>❌ {error}</span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        📝 Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter your blog post title..."
                        className="form-input"
                        maxLength={200}
                        required
                    />
                    <div className="char-count">
                        {formData.title.length}/200 characters
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="tags" className="form-label">
                        🏷️ Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="react, javascript, coding, tips..."
                        className="form-input"
                    />
                    <div className="form-help">
                        Separate multiple tags with commas. Each tag should be under 50 characters.
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="content" className="form-label">
                        📄 Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your blog post content here..."
                        className="form-textarea"
                        rows={15}
                        maxLength={10000}
                        required
                    />
                    <div className="char-count">
                        {formData.content.length}/10,000 characters
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(isEditing ? `/blogs/${id}` : '/blogs')}
                        className="cancel-btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    >
                        {loading ? (
                            <>
                                <div className="btn-spinner"></div>
                                {isEditing ? 'Updating...' : 'Publishing...'}
                            </>
                        ) : (
                            <>
                                {isEditing ? '💾 Update Post' : '🚀 Publish Post'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Preview Section */}
            {(formData.title || formData.content) && (
                <div className="preview-section">
                    <h3>👀 Preview</h3>
                    <div className="preview-card">
                        {formData.title && (
                            <h2 className="preview-title">{formData.title}</h2>
                        )}
                        
                        {formData.tags && (
                            <div className="preview-tags">
                                {formData.tags.split(',').map((tag, index) => {
                                    const trimmedTag = tag.trim();
                                    return trimmedTag ? (
                                        <span key={index} className="preview-tag">
                                            #{trimmedTag}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}
                        
                        {formData.content && (
                            <div className="preview-content">
                                {formData.content.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph || '\u00A0'}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogForm;
