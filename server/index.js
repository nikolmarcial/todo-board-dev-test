require('dotenv').config();
const express = require('express');
const app = express();
const { pool, sql } = require('./config/db');
const authenticateToken = require('./middleware/auth');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200'
}));


//Middleware
app.use(express.json());

//Routes
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

app.use('/api/users', usersRoute);
app.use('/api/tasks', authenticateToken, tasksRoute);

//Root Route
app.get('/', (req, res) => {
  res.send('SQL Server is WORKING!');
});

//Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
