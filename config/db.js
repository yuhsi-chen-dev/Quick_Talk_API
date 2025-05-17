const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10, // 最大數量
  idleTimeoutMillis: 30000, // 回收機制
  connectionTimeoutMillis: 2000, // 超時機制
});

async function connectWithRetry(retries = 5, delay = 1000) {
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ PostgreSQL connected');
      break;
    } catch (err) {
      console.error(`❌ DB connection failed. Retries left: ${retries - 1}`);
      retries --;
      if (retries == 0) throw err;
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

connectWithRetry();

module.exports = pool;