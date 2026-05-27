import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================
// 1. EXPRESS SERVER (Render)
// =========================
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Bot + Server running 🚀'
  });
});

// =========================
// 2. TELEGRAM BOT SETUP
// =========================
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('❌ BOT_TOKEN missing in environment variables');
  process.exit(1);
}

// polling mode (simpler for Render free tier)
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Bot is connected and running on server 🚀');
});

console.log('🤖 Bot started successfully');

// =========================
// 3. START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});