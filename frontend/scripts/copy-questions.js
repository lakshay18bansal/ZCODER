// This script copies questions.json to the frontend public folder for dev/demo use
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../../questions.json');
const dest = path.resolve(__dirname, '../public/questions.json');

fs.copyFileSync(src, dest);
console.log('questions.json copied to frontend/public');
