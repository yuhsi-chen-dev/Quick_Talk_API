const pool = require('../config/db');

// 建立新使用者
async function createUser(name, phoneNumber, about) {
  const query = `
    INSERT INTO users (name, phone_number, about)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, phoneNumber, about];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// 根據 user_id 查詢單一用戶
async function getUserById(userId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
}

// 根據 phone_number 查詢單一用戶
async function getUserByPhoneNumber(phone_number) {
  const result = await pool.query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phone_number]
  );
  return result.rows[0];
}

// 查詢所有使用者
async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

module.exports = {
  createUser,
  getUserById,
  getUserByPhoneNumber,
  getAllUsers,
};
