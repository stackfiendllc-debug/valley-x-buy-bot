import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json());

// =========================
// ENV (Render provides this automatically)
// =========================
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('❌ BOT_TOKEN missing in Render environment variables');
  process.exit(1);
}

// =========================
// BOT INIT
// =========================
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot is online and running...');

// =========================
// SIMPLE MEMORY (temporary storage)
// =========================
const users = {};
const orders = [];

// =========================
// EXPRESS SERVER
// =========================
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: true,
    users: Object.keys(users).length,
    orders: orders.length
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// =========================
// COMMANDS
// =========================

// START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  users[chatId] = {
    id: chatId,
    username: msg.from.username || 'unknown',
    joined: new Date()
  };

  bot.sendMessage(
    chatId,
    `🔥 Welcome to Valley X Buy Bot\n\nType /help to see commands.`
  );
});

// HELP
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`📌 COMMANDS:
/start - Start bot
/help - Help menu
/status - Bot status
/buy <item> - Create order`
  );
});

// STATUS
bot.onText(/\/status/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`✅ BOT STATUS: ONLINE
Users: ${Object.keys(users).length}
Orders: ${orders.length}
Server: Running on Render 🚀`
  );
});

// BUY COMMAND
bot.onText(/\/buy (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const item = match[1];

  const order = {
    id: orders.length + 1,
    user: chatId,
    item,
    status: 'pending',
    time: new Date()
  };

  orders.push(order);

  bot.sendMessage(
    chatId,
`🛒 ORDER CREATED
Item: ${item}
Order ID: #${order.id}
Status: pending`
  );
});

// FALLBACK MESSAGE HANDLER
bot.on('message', (msg) => {
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  bot.sendMessage(msg.chat.id, `Received: "${text}"`);
});