const { getChannel } = require('../config/rabbitmq');

const QUEUE_NAME = 'messages';

async function publishMessageToQueue(messageData) {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  const buffer = Buffer.from(JSON.stringify(messageData));
  channel.sendToQueue(QUEUE_NAME, buffer, {
    persistent: true,
  });

  console.log(`📤 Published message to queue [${QUEUE_NAME}]`);
}

module.exports = {
  publishMessageToQueue,
};
