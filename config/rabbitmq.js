const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ() {
  if (channel) return;

  try {
    connection = await amqp.connect('amqp://localhost');

    connection.on('error', (err) => {
      console.error('❌ RabbitMQ connection error:', err.message);
    });

    connection.on('close', () => {
      console.warn('⚠️ RabbitMQ connection closed. Attempting to reconnect...');
      channel = null;
      connection = null;
      setTimeout(connectRabbitMQ, 5000); // simple retry after 5s
    });

    channel = await connection.createChannel();
    console.log('✅ RabbitMQ connected');
  } catch (err) {
    console.error('❌ RabbitMQ connection failed:', err.message);
    setTimeout(connectRabbitMQ, 5000); // retry after 5s
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
