const pool = require('../config/db');

// 查找或建立 direct conversation（1:1）
async function findOrCreateDirectConversation(userAId, userBId) {
  // STEP 1：查詢是否已存在 1:1 對話
  const checkQuery = `
    SELECT c.conversation_id
    FROM conversations c
    JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
    WHERE c.conversation_type = 'direct'
    GROUP BY c.conversation_id
    HAVING 
      COUNT(*) = 2 AND
      COUNT(CASE WHEN cp.user_id = $1 OR cp.user_id = $2 THEN 1 END) = 2
    LIMIT 1;
  `;
  const checkResult = await pool.query(checkQuery, [userAId, userBId]);

  if (checkResult.rows.length > 0) {
    const conversationId = checkResult.rows[0].conversation_id;
    return {
      existed: true,
      conversation: { conversation_id: conversationId },
    };
  }

  // STEP 2：若無則建立 conversation 與 participants
  const createConversationQuery = `
    INSERT INTO conversations (conversation_type)
    VALUES ('direct')
    RETURNING *;
  `;
  const createResult = await pool.query(createConversationQuery);
  const newConversation = createResult.rows[0];

  const insertParticipantsQuery = `
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES ($1, $2), ($1, $3);
  `;
  await pool.query(insertParticipantsQuery, [
    newConversation.conversation_id,
    userAId,
    userBId,
  ]);

  return {
    existed: false,
    conversation: newConversation,
  };
}

module.exports = {
  findOrCreateDirectConversation,
};
