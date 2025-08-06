const express = require('express');
const router = express.Router();
const { pool, sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/auth');

//Get all users
router.get('/', async (req, res) => {
  try {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM users');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).send('Server Error');
  }
});

// Register new user
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool
        .request()
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, hashedPassword)
        .query(
          'INSERT INTO users (username, password) VALUES (@username, @password)'
        );

      res
        .status(201)
        .json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      if (
        err.originalError &&
        err.originalError.code === 2627 // SQL Server code for duplicate key
      ) {
        return res
          .status(409)
          .json({ success: false, message: 'Username already exists' });
      }

      console.error('Registration Error:', err);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
);


//Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' });
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
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, you have accessed a protected route!`
  });
});

module.exports = router;
