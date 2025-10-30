const express = require("express");
const axios = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors"); 

const app = express();

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;
const RENDER_URL = process.env.RENDER_URL;

// 🔑 CRITICAL FIX: Ensure express.json() is applied globally and early to parse the request body
app.use(express.json()); 

// --- CORS Configuration ---
// This middleware explicitly allows requests only from your Vercel frontend URL.
app.use(cors({
    origin: process.env.WEB_LINK,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// --------------------------

const bot = new Telegraf(TOKEN);

// Ensure text.json exists and is readable (Assuming this file is present)
let content = {};
try {
  // Note: fs module might not be available or practical on some hosting environments.
  content = JSON.parse(fs.readFileSync("text.json", "utf-8"));
} catch (error) {
  console.error("Error reading or parsing text.json. Using fallback messages.", error.message);
  // Fallback structure if file is missing
  content = {
    welcomeMessage: "Welcome! Click the button to launch the Mini App.",
    goToMiniAppButton: "Launch App"
  };
}

bot.start((ctx) => {
  ctx.reply(content.welcomeMessage, {
    reply_markup: {
      inline_keyboard: [[{ text: content.goToMiniAppButton, web_app: { url: WEBLINK } }]],
    },
  });
});

// Webhook setup (only if RENDER_URL is defined)
const BOT_PATH = `/bot${TOKEN}`;
if (RENDER_URL) {
  bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`);
  // Telegraf webhook handler
  app.use(bot.webhookCallback(BOT_PATH));
} else {
    console.warn("RENDER_URL not set. Webhook not configured.");
}


// Subscription check endpoint //
app.post("/checkSubscription", async (req, res) => {
  
  // 🛡️ Defensive Check: Prevents crash if req.body is undefined
  if (!req.body) {
    console.error("Request body is undefined or null. Check middleware placement or client headers.");
    return res.status(400).json({ success: false, message: "Request body is empty or malformed." });
  }
  
  const { userId, channelUsername } = req.body; 

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing userId or channelUsername parameter." });
  }

  try {
    const chatId = channelUsername; // e.g., "-1001344597324"
    const user_id = String(userId);

    const response = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      { params: { chat_id: chatId, user_id: user_id } }
    );

    const result = response.data;
    if (!result.ok) {
        console.error("Telegram API response not OK:", result);
        return res.status(500).json({ success: false, message: "Telegram API reported an error." });
    }

    const isMember = ["member", "administrator", "creator"].includes(result.result.status);
    
    return res.json({ 
        success: isMember, 
        message: isMember ? "✅ Subscribed! Max energy is now 60." : "❌ Not subscribed. Please join the channel." 
    });
  } catch (error) {
    const telegramErrorDescription = error.response?.data?.description;
    
    if (telegramErrorDescription) {
        console.error("Telegram API Error:", telegramErrorDescription);
        // Returns the clear error like "Bad Request: member list is inaccessible"
        return res.status(400).json({ 
            success: false, 
            message: `Telegram Error: ${telegramErrorDescription}. Make sure the bot is an admin in the channel.` 
        });
    }

    console.error("Critical Server Crash Error:", error.message);
    return res.status(500).json({ 
        success: false, 
        message: `Internal Server Error: ${error.message}. Check Render logs.` 
    });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));