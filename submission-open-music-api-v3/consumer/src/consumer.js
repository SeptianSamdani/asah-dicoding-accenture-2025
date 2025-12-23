import dotenv from 'dotenv';
import amqp from 'amqplib';
import MailSender from './MailSender.js';
import Listener from './listener.js';

dotenv.config();

const init = async () => {
  const mailSender = new MailSender();
  const listener = new Listener(mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', { durable: true });

  channel.consume('export:playlist', (message) => {
    listener.listen(message);
  }, { noAck: true });

  console.log('✓ Consumer started and waiting for messages...');
};

init();