require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize bot but don't start polling yet
let bot;

// Health check endpoint - MUST respond quickly
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    bot: 'SmartWordConverterBot',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('SmartWordConverterBot is running!');
});

// Start the server FIRST
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  
  // Now initialize and start the bot AFTER server is running
  try {
    if (!process.env.BOT_TOKEN) {
      console.error('❌ BOT_TOKEN is required in environment variables');
      return;
    }

    bot = new TelegramBot(process.env.BOT_TOKEN, { 
      polling: true
    });

    // Import handlers after bot is initialized
    const startHandler = require('./src/handlers/startHandler');
    const convertHandler = require('./src/handlers/convertHandler');

    // Command handlers
    bot.onText(/\/start/, (msg) => startHandler(bot, msg));
    bot.onText(/\/help/, (msg) => startHandler(bot, msg));

    // Handle text messages for conversion
    bot.on('message', async (msg) => {
      try {
        if (msg.text && msg.text.startsWith('/')) return;
        await convertHandler(bot, msg);
      } catch (error) {
        console.error('Message handling error:', error);
        bot.sendMessage(msg.chat.id, '❌ An error occurred. Please try again.');
      }
    });

    bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
    });

    console.log('✅ Bot initialized successfully');
  } catch (error) {
    console.error('❌ Bot initialization error:', error.message);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  if (bot) {
    bot.stopPolling();
  }
  server.close(() => {
    process.exit(0);
  });
});
