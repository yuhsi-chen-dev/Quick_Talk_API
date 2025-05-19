const redis = require('../config/redis');

// 1. 更新 last_active（5 分鐘 TTL）
async function updateLastActive(userId) {
  const now = Date.now();
  await redis.set(`last_active:${userId}`, now, 'EX', 300);
}

// 2. 判斷是否在線（3 秒內活動）
async function isUserOnline(userId) {
  const lastSeen = await redis.get(`last_active:${userId}`);
  if (!lastSeen) return false;
  return (Date.now() - parseInt(lastSeen)) <= 3000;
}

// 3. 累加未讀訊息
async function incrementUnread(userId) {
  await redis.incr(`unread_count:${userId}`);
}

// 4. 清除未讀訊息
async function resetUnread(userId) {
  await redis.set(`unread_count:${userId}`, 0);
}

module.exports = {
  updateLastActive,
  isUserOnline,
  incrementUnread,
  resetUnread,
};
