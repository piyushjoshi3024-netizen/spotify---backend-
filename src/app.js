const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const musicRoutes = require('./routes/music.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.json());
app.use(cookieParser());
app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API running'));

module.exports = app;

