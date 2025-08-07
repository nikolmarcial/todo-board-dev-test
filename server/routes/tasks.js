const express = require('express');
const router = express.Router();
const { pool, sql } = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Get all tasks for logged-in user, optionally filtered by label
router.get('/', authenticateToken, async (req, res) => {
  const label = req.query.label;
  let query = 'SELECT * FROM tasks WHERE created_by = @userId';
  
  try {
    const request = pool.request().input('userId', sql.Int, req.user.id);

    if (label) {
      query += ' AND label = @label';
      request.input('label', sql.VarChar, label);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Task Fetch Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, label, description, due_date } = req.body;

  try {
    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('label', sql.NVarChar, label)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('due_date', sql.DateTime, due_date)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        INSERT INTO tasks (title, label, description, due_date, created_by)
        VALUES (@title, @label, @description, @due_date, @created_by)
      `);

    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('Task Creation Failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, completed } = req.body;
  const { id } = req.params;

  try {
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar(sql.MAX), title)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('completed', sql.Bit, completed)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        UPDATE tasks
        SET title = @title, description = @description, completed = @completed
        WHERE id = @id AND created_by = @created_by
      `);

    res.send('Task updated successfully');
  } catch (err) {
    console.error('Task Update Error:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input('id', sql.Int, id)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        DELETE FROM tasks
        WHERE id = @id AND created_by = @created_by
      `);

    res.send('Task deleted successfully');
  } catch (err) {
    console.error('Task Deletion Error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
