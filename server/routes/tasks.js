const express = require('express');
const router = express.Router();
const { pool, sql } = require('../config/db');
const authenticateToken = require('../middleware/auth');

// GET all tasks for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.request()
      .input('created_by', sql.Int, req.user.id)
      .query('SELECT * FROM tasks WHERE created_by = @created_by');
    res.json(result.recordset);
  } catch (err) {
    console.error('Task Fetch Error:', err);
    res.status(500).send('Server Error');
  }
});

// POST new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;

  try {
    await pool.request()
      .input('title', sql.VarChar(sql.MAX), title)
      .input('description', sql.VarChar(sql.MAX), description)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        INSERT INTO tasks (title, description, created_by)
        VALUES (@title, @description, @created_by)
      `);

    res.status(201).send('Task created successfully');
  } catch (err) {
    console.error('Task Creation Error:', err);
    res.status(500).send('Server Error');
  }
});

// PUT update task
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, completed } = req.body;
  const { id } = req.params;

  try {
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(sql.MAX), title)
      .input('description', sql.VarChar(sql.MAX), description)
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

// DELETE task
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
