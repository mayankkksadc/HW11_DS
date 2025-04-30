const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Shipping = require('./shipping.model');
const { v4: uuidv4 } = require('uuid');

// MongoDB Connection
mongoose.connect('mongodb+srv://mayankkapadia:Saibaba%402016@cluster0.3f2pq.mongodb.net/shipping?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const kafka = new Kafka({
  clientId: 'shipping-service',
  brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'shipping-group' });
async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-confirmed', fromBeginning: false });
  console.log("🚚 Kafka consumer started. Waiting for messages...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const raw = message.value.toString();
        console.log("📦 Received message from Kafka:", raw);
        const data = JSON.parse(raw);
        const newShipping = new Shipping({
          itemId: data.itemId,
          itemName: data.itemName,
          quantity: data.quantity,
          trackingId: 'SHIP-' + uuidv4().slice(0, 8).toUpperCase(),
        });
        const saved = await newShipping.save();
        console.log('✅ Shipping record created:', saved);
      } catch (err) {
        console.error('❌ Error processing message:', err.message);
      }
    },
  });
}
start().catch(console.error);
