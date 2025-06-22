const mongoose = require('mongoose');

// Comment schema for nested comments in blog posts
const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Blog post schema
const blogSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 10000
    },
    tags: [{
        type: String,
        maxlength: 50
    }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Text index for search functionality on title and content
blogSchema.index({ 
    title: 'text', 
    content: 'text' 
});

// Update the updatedAt field before saving
blogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
