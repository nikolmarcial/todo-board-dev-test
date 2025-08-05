require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('SQL Server is WORKING!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
