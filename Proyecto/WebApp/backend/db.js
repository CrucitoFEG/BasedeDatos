// backend/db.js
const oracledb = require('oracledb');

const dbConfig = {
  user: 'PDBADMIN',
  password: 'abc123',
  connectString: 'localhost:1521/FREEPDB1'
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { getConnection };
