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
  const newMessage = result.rows[0];

  // 更新 conversations 表中的 last_message_id
  const updateQuery = `
    UPDATE conversations
    SET last_message_id = $1
    WHERE conversation_id = $2;
  `;
  await pool.query(updateQuery, [newMessage.message_id, conversationId]);

  return newMessage;
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
