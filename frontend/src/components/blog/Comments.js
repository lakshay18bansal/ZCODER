import React, { useState } from 'react';
import axios from 'axios';
import './Comments.css';

const Comments = ({ postId, comments, currentUser, onCommentAdded, onCommentDeleted }) => {
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (!currentUser) {
            setError('You must be logged in to comment');
            return;
        }

        console.log(`💬 [COMMENTS] Adding comment to post ${postId} by ${currentUser}`);
        console.log(`📝 [COMMENTS] Comment length: ${newComment.length} characters`);
        
        setSubmitting(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `https://zcoder-backend-b6ii.onrender.com/api/blogs/${postId}/comments`,
                { text: newComment.trim() },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log(`✅ [COMMENTS] Comment added successfully with ID: ${response.data._id}`);
            
            // Clear the form and notify parent
            setNewComment('');
            onCommentAdded(response.data);
            
        } catch (error) {
            console.error('❌ [COMMENTS] Error adding comment:', error);
            
            if (error.response?.status === 401) {
                setError('You must be logged in to comment');
            } else if (error.response?.status === 404) {
                setError('Blog post not found');
            } else {
                setError('Failed to add comment. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        console.log(`🗑️ [COMMENTS] Deleting comment ${commentId} by ${currentUser}`);
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `https://zcoder-backend-b6ii.onrender.com/api/blogs/${postId}/comments/${commentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log(`✅ [COMMENTS] Comment deleted successfully`);
            onCommentDeleted(commentId);
            
        } catch (error) {
            console.error('❌ [COMMENTS] Error deleting comment:', error);
            
            if (error.response?.status === 401) {
                alert('You must be logged in to delete comments');
            } else if (error.response?.status === 403) {
                alert('You can only delete your own comments');
            } else {
                alert('Failed to delete comment. Please try again.');
            }
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

    return (
        <div className="comments-container">
            <div className="comments-header">
                <h3>💬 Comments ({comments.length})</h3>
            </div>

            {/* Add Comment Form */}
            {currentUser ? (
                <form onSubmit={handleSubmitComment} className="comment-form">
                    {error && (
                        <div className="comment-error">
                            ❌ {error}
                        </div>
                    )}
                    
                    <div className="comment-form-header">
                        <div className="commenter-info">
                            <span className="commenter-avatar">👤</span>
                            <span className="commenter-name">Commenting as {currentUser}</span>
                        </div>
                    </div>
                    
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="comment-textarea"
                        rows={3}
                        maxLength={1000}
                        disabled={submitting}
                    />
                    
                    <div className="comment-form-footer">
                        <div className="char-count">
                            {newComment.length}/1,000 characters
                        </div>
                        <button
                            type="submit"
                            className="submit-comment-btn"
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Posting...
                                </>
                            ) : (
                                '💬 Add Comment'
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>Please log in to join the conversation!</p>
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">
                        <p>No comments yet. Be the first to share your thoughts! 💭</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author-info">
                                    <span className="comment-avatar">👤</span>
                                    <div className="comment-meta">
                                        <span className="comment-author">
                                            {comment.author}
                                            {comment.author === currentUser && (
                                                <span className="author-badge">You</span>
                                            )}
                                        </span>
                                        <span className="comment-date">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                
                                {currentUser === comment.author && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="delete-comment-btn"
                                        title="Delete comment"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                            
                            <div className="comment-content">
                                {comment.text.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
