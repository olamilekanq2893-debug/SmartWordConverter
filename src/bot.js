const TelegramBot = require('node-telegram-bot-api');

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required in environment variables');
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  polling: true,
  onlyFirstMatch: true
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('✅ Bot instance created');

module.exports = bot;
