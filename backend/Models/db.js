const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Password123',
  server: 'KHADIJA-PC\\SQLEXPRESS',
  database: 'StaySphere',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('SQL Server connected');
    return pool;
  })
  .catch(err => console.error(' Connection failed:', err.message));

module.exports = { sql, poolPromise };