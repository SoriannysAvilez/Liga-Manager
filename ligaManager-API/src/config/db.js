const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: 'localhost',
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  instanceName: 'SQLEXPRESS'
};

console.log('CONFIG ACTUAL:', dbConfig);


const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
   console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch((error) => {
  console.error('❌ Error de conexión:', error);
    process.exit(1);
  });

  

module.exports = { sql, poolPromise };