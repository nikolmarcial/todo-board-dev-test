const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString: process.env.DB_CONNECTION_STRING,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
  }
};

const pool = new sql.ConnectionPool(config);

pool.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((err) => {
    console.error('SQL Server Connection Error:\n', err);
});

module.exports = {pool, sql};
