const pool = require('../config/db');

// 建立一筆訊息
async function createMessage({
  conversationId,
  senderId,
  receiverId,
  messageType,
  messageContent,
  messageStatus = 'sent',
}) {
  const query = `
    INSERT INTO messages (
      conversation_id,
      sender_id,
      receiver_id,
      message_type,
      message_content,
      message_status
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    conversationId,
    senderId,
    receiverId,
    messageType,
    messageContent,
    messageStatus,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// 查詢某個 conversation 的所有訊息（依時間排序）
async function getMessagesByConversation(conversationId) {
  const result = await pool.query(
    `SELECT * FROM messages
      WHERE conversation_id = $1
      ORDER BY sent_at ASC
    `,
    [conversationId]
  );
  return result.rows;
}

module.exports = {
  createMessage,
  getMessagesByConversation,
};
