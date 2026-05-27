import 'dotenv/config';
import express from 'express';

const app = express();

// Middleware (safe default for APIs/bots)
app.use(express.json());

// Health check route (Render needs this for uptime checks)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Valley X Buy Bot is running 🚀'
  });
});

// Example environment variable check (optional but useful)
console.log('Bot starting...');
console.log('Environment loaded:', process.env.NODE_ENV || 'development');

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});