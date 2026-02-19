require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/services', require('../routes/services'));
app.use('/api/child', require('../routes/child'));
app.use('/api/payments', require('../routes/payments'));

// Healthcheck route
app.get('/', (req, res) => res.json({ message: 'AshMediaBoost Backend Running 🚀' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
