const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware to verify JWT tokens
const authMiddleware = async (req, res, next) => {
    console.log('🔐 [AUTH MIDDLEWARE] Checking authentication...');
    
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('❌ [AUTH MIDDLEWARE] No token provided');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        console.log('🔍 [AUTH MIDDLEWARE] Token found, verifying...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('✅ [AUTH MIDDLEWARE] Token verified for user ID:', decoded.id);
        
        // Find user to get username
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('❌ [AUTH MIDDLEWARE] User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            id: decoded.id,
            username: user.username
        };
        
        console.log('👤 [AUTH MIDDLEWARE] User authenticated:', req.user.username);
        next();
    } catch (error) {
        console.error('❌ [AUTH MIDDLEWARE] Token verification failed:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
