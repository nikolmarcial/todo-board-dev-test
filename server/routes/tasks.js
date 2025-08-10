const express = require('express');
const router = express.Router();
const { pool, sql } = require('../config/db');
const authenticateToken = require('../middleware/auth');

//Check if due date is near
function getTaskStatusFlags(dueDate, label, daysBefore = 3) {
  if (label === 'Done') return { isExpiringSoon: false, isOverdue: false };

  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  return {
    isExpiringSoon: diffDays <= daysBefore && diffDays >= 0,
    isOverdue: diffDays < 0
  };
}

//Get all tasks for logged-in user, optionally filtered by label
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

    // Add expiry flag
    const tasks = result.recordset.map(task => {
      const flags = getTaskStatusFlags(task.due_date, task.label);
      return { ...task, ...flags };
    });

    res.json(tasks);
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

// Update a task (with label change history tracking)
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, completed, label, due_date } = req.body;
  const { id } = req.params;

  try {
    //Get old label
    const currentTask = await pool.request()
      .input('id', sql.Int, id)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        SELECT label FROM tasks
        WHERE id = @id AND created_by = @created_by
      `);

    if (currentTask.recordset.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const oldLabel = currentTask.recordset[0].label;

    //Update the task
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar(sql.MAX), title)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('label', sql.NVarChar(sql.MAX), label)
      .input('due_date', sql.DateTime, due_date)
      .input('completed', sql.Bit, completed)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        UPDATE tasks
        SET 
          title = @title, 
          description = @description, 
          label = @label, 
          due_date = @due_date, 
          completed = @completed
        WHERE id = @id AND created_by = @created_by
      `);

    // If label changed, record history
    if (oldLabel !== label) {
      await pool.request()
        .input('task_id', sql.Int, id)
        .input('old_label', sql.NVarChar(50), oldLabel)
        .input('new_label', sql.NVarChar(50), label)
        .input('moved_by', sql.Int, req.user.id) // ✅ use INT user id
        .query(`
          INSERT INTO task_history (task_id, old_label, new_label, moved_by)
          VALUES (@task_id, @old_label, @new_label, @moved_by)
        `);
    }



    res.json({ message: 'Task updated successfully' });

  } catch (err) {
    console.error('Task Update Error:', err);
    res.status(500).send('Server Error');
  }
});


// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
        const result = await pool.request()
        .input('id', sql.Int, id)
        .input('created_by', sql.Int, req.user.id)
        .query(`
          DELETE FROM tasks
          WHERE id = @id AND created_by = @created_by
        `);

    if (result.rowsAffected[0] === 0) {
      return res.status(403).json({ message: 'Unauthorized or task not found' });
    }

      res.json({ message: 'Task deleted successfully'});

  } catch (err) {
    console.error('Task Deletion Error:', err);
    res.status(500).send('Server Error');
  }
}); 

// Get task history
router.get('/:id/history', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.request()
      .input('task_id', sql.Int, id)
      .input('created_by', sql.Int, req.user.id)
      .query(`
        SELECT th.old_label, th.new_label, th.changed_at, th.moved_by AS changed_by
        FROM task_history th
        JOIN tasks t ON th.task_id = t.id
        WHERE th.task_id = @task_id
          AND t.created_by = @created_by
        ORDER BY th.changed_at DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch Task History Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
