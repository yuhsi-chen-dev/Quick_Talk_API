const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ RabbitMQ connected');
  } catch (err) {
    console.error('❌ RabbitMQ connection failed:', err);
    process.exit(1);
  }
}

function getChannel() {
  if (!channel) throw new Error('RabbitMQ not connected');
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};
