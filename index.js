require('dotenv').config();
const express = require('express');
const bot = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', bot: 'SmartWordConverterBot' });
});

app.get('/', (req, res) => {
  res.send('SmartWordConverterBot is running!');
});

// Start the bot
bot.startPolling();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log('🤖 SmartWordConverterBot is active!');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  bot.stopPolling();
  process.exit(0);
});
