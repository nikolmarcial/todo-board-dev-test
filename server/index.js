require('dotenv').config();
const express = require('express');
const app = express();
const { pool, sql } = require('./config/db');

//Used for login
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const PORT = process.env.PORT || 5000;

const authenticateToken = require('./middleware/auth');

//Middleware to parse JSON
app.use(express.json());

//Root Route
app.get('/', (req, res) => {
  res.send('SQL Server is WORKING!');
});


//Get all users
app.get('/api/users', async (req, res) => {
  try {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM users');
    console.log('SQL Result:', result);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).send('Server Error');
  }
});

//Register a new user
app.post('/api/users/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //hash password

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hashedPassword)
      .query(`
        INSERT INTO users (username, password)
        VALUES (@username, @password)
      `);

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('User registration failed:', err);
    res.status(500).send('Server Error');
  }
});

//Login a user
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query(`SELECT * FROM users WHERE username = @username`);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server Error');
  }
});

//Protected Route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.username}, you have accessed a protected route!`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
