import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TOKEN_MINT = process.env.TOKEN_MINT;
const RPC_URL = process.env.RPC_URL;

let seen = new Set();

async function sendTelegram(text) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text,
    parse_mode: "HTML"
  });
}

async function check() {
  try {
    const res = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [TOKEN_MINT, { limit: 10 }]
    });

    const txs = res.data.result;

    for (let tx of txs) {
      if (seen.has(tx.signature)) continue;
      seen.add(tx.signature);

      await sendTelegram(`
🚨 NEW ACTIVITY

Token: ${TOKEN_MINT}
Signature: ${tx.signature}
Time: ${new Date(tx.blockTime * 1000).toLocaleString()}

Check explorer for buy/sell details.
      `);
    }
  } catch (e) {
    console.log(e.message);
  }
}

setInterval(check, 15000);

console.log("Bot running...");
