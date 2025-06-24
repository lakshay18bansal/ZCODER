const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const codeRoutes = require('./routes/code');
const questionRoutes = require('./routes/questions');
const bookmarkRoutes = require('./routes/bookmarks');
const blogRoutes = require('./routes/blogs');
dotenv.config();

const app = express();

const allowedOrigins = [
  'https://zcoder-frontend-bkfn.onrender.com',
  'http://localhost:3000'  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use((req, res, next) => {
  console.log("Received a request!! :", req.method, req.url);
  next();
});
app.use('/api/bookmarks', bookmarkRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
