require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage for demo
const users = [
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' }
];
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'ashimkagabasiraji256'
};
const services = [
  { platform: 'Instagram', service: 'Likes', price: '2.40', currency: 'KE' },
  { platform: 'TikTok', service: 'Views', price: '1.12', currency: 'KE' },
  { platform: 'YouTube', service: 'Subscribers', price: '4.80', currency: 'KE' }
];
const orders = [];

// Routes
app.use('/api/auth', require('./routes/auth')(adminCredentials));
app.use('/api/users', require('./routes/users')(users));
app.use('/api/services', require('./routes/services')(services));
app.use('/api/child', require('./routes/child')(orders));

// Fallback route for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
