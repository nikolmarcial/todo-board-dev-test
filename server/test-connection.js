// test-connection.js
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString: process.env.DB_CONNECTION_STRING
};

sql.connect(config)
  .then(() => {
    console.log('TEST: Connected to SQL Server');
  })
  .catch(err => {
    console.error('TEST: Failed to connect:', err);
  });
