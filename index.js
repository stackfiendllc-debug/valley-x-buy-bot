import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TOKEN_MINT = process.env.TOKEN_MINT;
const RPC_URL = process.env.RPC_URL;

// safety checks (prevents Render silent crash)
if (!BOT_TOKEN || !CHAT_ID || !TOKEN_MINT || !RPC_URL) {
  console.log("❌ Missing environment variables");
  process.exit(1);
}

async function sendTelegram(text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML"
    });
  } catch (err) {
    console.log("Telegram error:", err.message);
  }
}

let seen = new Set();

async function check() {
  try {
    const res = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [TOKEN_MINT, { limit: 5 }]
    });

    const txs = res.data.result || [];

    for (let tx of txs) {
      if (seen.has(tx.signature)) continue;
      seen.add(tx.signature);

      await sendTelegram(`
🚨 <b>NEW ACTIVITY DETECTED</b>

Token: ${TOKEN_MINT}
Signature: <code>${tx.signature}</code>

Time: ${tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A"}
      `);
    }

  } catch (err) {
    console.log("RPC error:", err.message);
  }
}

// keep bot alive (IMPORTANT for Render)
setInterval(check, 15000);

// initial run
check();

console.log("✅ Buy bot running...");
