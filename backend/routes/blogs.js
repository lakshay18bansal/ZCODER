const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');

// GET /api/blogs - List all blog posts with pagination and filtering
router.get('/', async (req, res) => {
    console.log('📚 [BLOGS] Fetching all blog posts with filters:', req.query);
    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter query
        let filterQuery = {};
        
        // Text search in title and content
        if (req.query.search) {
            filterQuery.$text = { $search: req.query.search };
            console.log(`� [BLOGS] Text search: "${req.query.search}"`);
        }
        
        // Filter by tag
        if (req.query.tag) {
            filterQuery.tags = { $in: [req.query.tag] };
            console.log(`🏷️ [BLOGS] Tag filter: "${req.query.tag}"`);
        }
        
        // Filter by author
        if (req.query.author) {
            filterQuery.author = req.query.author;
            console.log(`👤 [BLOGS] Author filter: "${req.query.author}"`);
        }
        
        // Filter by date range
        if (req.query.dateRange && req.query.dateRange !== 'all') {
            const now = new Date();
            let startDate;
            
            switch (req.query.dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    startDate = null;
            }
            
            if (startDate) {
                filterQuery.createdAt = { $gte: startDate };
                console.log(`📅 [BLOGS] Date filter: ${req.query.dateRange} (from ${startDate})`);
            }
        }
        
        console.log(`�📄 [BLOGS] Pagination: page=${page}, limit=${limit}, skip=${skip}`);
        console.log(`🔍 [BLOGS] Filter query:`, filterQuery);
        
        // Create sort order - prioritize text search score if searching
        let sortOrder = { createdAt: -1 };
        if (req.query.search) {
            sortOrder = { score: { $meta: 'textScore' }, createdAt: -1 };
        }
        
        const blogs = await Blog.find(filterQuery)
            .select('title content author tags createdAt updatedAt')
            .sort(sortOrder)
            .skip(skip)
            .limit(limit);
            
        const total = await Blog.countDocuments(filterQuery);
        
        console.log(`✅ [BLOGS] Retrieved ${blogs.length} blogs out of ${total} total (filtered)`);
        
        res.json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalBlogs: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            filters: {
                applied: Object.keys(req.query).filter(key => 
                    ['search', 'tag', 'author', 'dateRange'].includes(key) && 
                    req.query[key] && 
                    req.query[key] !== 'all'
                ),
                total: total
            }
        });
    } catch (error) {
        console.error('❌ [BLOGS] Error fetching blogs:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/blogs/:id - Fetch single blog post with comments
router.get('/:id', async (req, res) => {
    console.log(`📖 [BLOG DETAIL] Fetching blog post: ${req.params.id}`);
    
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            console.log(`❌ [BLOG DETAIL] Blog not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        console.log(`✅ [BLOG DETAIL] Blog found: "${blog.title}" by ${blog.author}`);
        console.log(`💬 [BLOG DETAIL] Comments count: ${blog.comments.length}`);
        
        res.json(blog);
    } catch (error) {
        console.error('❌ [BLOG DETAIL] Error fetching blog:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/blogs - Create new blog post (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
    console.log(`✍️ [CREATE BLOG] User ${req.user.username} creating new blog post...`);
    
    try {
        const { title, content, tags } = req.body;
        
        console.log(`📝 [CREATE BLOG] Title: "${title}"`);
        console.log(`🏷️ [CREATE BLOG] Tags: [${tags ? tags.join(', ') : 'none'}]`);
        console.log(`📄 [CREATE BLOG] Content length: ${content ? content.length : 0} characters`);
        
        if (!title || !content) {
            console.log('❌ [CREATE BLOG] Missing required fields');
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        const newBlog = new Blog({
            title,
            content,
            tags: tags || [],
            author: req.user.username,
            comments: []
        });
        
        const savedBlog = await newBlog.save();
        
        console.log(`✅ [CREATE BLOG] Blog created successfully with ID: ${savedBlog._id}`);
        
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('❌ [CREATE BLOG] Error creating blog:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/blogs/:id - Update own blog post (requires authentication)
router.put('/:id', authMiddleware, async (req, res) => {
    console.log(`✏️ [UPDATE BLOG] User ${req.user.username} updating blog: ${req.params.id}`);
    
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            console.log(`❌ [UPDATE BLOG] Blog not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        if (blog.author !== req.user.username) {
            console.log(`🚫 [UPDATE BLOG] Unauthorized: ${req.user.username} cannot edit ${blog.author}'s post`);
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }
        
        const { title, content, tags } = req.body;
        
        console.log(`📝 [UPDATE BLOG] Updating fields: title=${!!title}, content=${!!content}, tags=${!!tags}`);
        
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (tags) blog.tags = tags;
        
        const updatedBlog = await blog.save();
        
        console.log(`✅ [UPDATE BLOG] Blog updated successfully`);
        
        res.json(updatedBlog);
    } catch (error) {
        console.error('❌ [UPDATE BLOG] Error updating blog:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/blogs/:id - Delete own blog post (requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
    console.log(`🗑️ [DELETE BLOG] User ${req.user.username} deleting blog: ${req.params.id}`);
    
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            console.log(`❌ [DELETE BLOG] Blog not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        if (blog.author !== req.user.username) {
            console.log(`🚫 [DELETE BLOG] Unauthorized: ${req.user.username} cannot delete ${blog.author}'s post`);
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        await Blog.findByIdAndDelete(req.params.id);
        
        console.log(`✅ [DELETE BLOG] Blog deleted successfully`);
        
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('❌ [DELETE BLOG] Error deleting blog:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/blogs/:id/comments - Add comment to post (requires authentication)
router.post('/:id/comments', authMiddleware, async (req, res) => {
    console.log(`💬 [ADD COMMENT] User ${req.user.username} commenting on blog: ${req.params.id}`);
    
    try {
        const { text } = req.body;
        
        if (!text) {
            console.log('❌ [ADD COMMENT] Comment text is required');
            return res.status(400).json({ message: 'Comment text is required' });
        }
        
        console.log(`📝 [ADD COMMENT] Comment length: ${text.length} characters`);
        
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            console.log(`❌ [ADD COMMENT] Blog not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        const newComment = {
            author: req.user.username,
            text,
            createdAt: new Date()
        };
        
        blog.comments.push(newComment);
        const updatedBlog = await blog.save();
        
        const addedComment = blog.comments[blog.comments.length - 1];
        
        console.log(`✅ [ADD COMMENT] Comment added successfully with ID: ${addedComment._id}`);
        console.log(`💬 [ADD COMMENT] Total comments on this post: ${blog.comments.length}`);
        
        res.status(201).json(addedComment);
    } catch (error) {
        console.error('❌ [ADD COMMENT] Error adding comment:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/blogs/:id/comments/:cid - Delete own comment (requires authentication)
router.delete('/:id/comments/:cid', authMiddleware, async (req, res) => {
    console.log(`🗑️ [DELETE COMMENT] User ${req.user.username} deleting comment: ${req.params.cid} from blog: ${req.params.id}`);
    
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            console.log(`❌ [DELETE COMMENT] Blog not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Blog post not found' });
        }
        
        const comment = blog.comments.id(req.params.cid);
        
        if (!comment) {
            console.log(`❌ [DELETE COMMENT] Comment not found: ${req.params.cid}`);
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        if (comment.author !== req.user.username) {
            console.log(`🚫 [DELETE COMMENT] Unauthorized: ${req.user.username} cannot delete ${comment.author}'s comment`);
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        
        blog.comments.pull(req.params.cid);
        await blog.save();
        
        console.log(`✅ [DELETE COMMENT] Comment deleted successfully`);
        console.log(`💬 [DELETE COMMENT] Remaining comments on this post: ${blog.comments.length}`);
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('❌ [DELETE COMMENT] Error deleting comment:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
