import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================
// SERVER
// =========================
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Valley X Buy Bot Active 🚀'
  });
});

// =========================
// BOT SETUP
// =========================
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('Missing BOT_TOKEN');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot is live and listening...');

// =========================
// COMMANDS
// =========================

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Welcome 🔥\n\nValley X Buy Bot is active.\nUse /help to see commands.`
  );
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Commands List:\n\n/start - Start bot\n/help - Commands\n/status - Check bot status`
  );
});

// /status
bot.onText(/\/status/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `✅ Bot is running normally on Render\nServer is active 🚀`
  );
});

// fallback message handler
bot.on('message', (msg) => {
  const text = msg.text;

  if (text.startsWith('/')) return; // ignore commands

  bot.sendMessage(msg.chat.id, `I received: "${text}"`);
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});