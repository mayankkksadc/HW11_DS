const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "test-producer",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
const run = async () => {
  await producer.connect();
  await producer.send({
    topic: "order-confirmed",
    messages: [
      {
        value: JSON.stringify({
          itemId: "123",
          itemName: "Notebook",
          quantity: 2,
        }),
      },
    ],
  });
  console.log("✅ Test message sent to 'order-confirmed'");
  await producer.disconnect();
};
run();
