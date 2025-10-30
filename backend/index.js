const express = require("express");
const axios = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors");

const app = express();

// --- CORS CONFIGURATION FIX ---
app.use(cors({
    origin: process.env.WEB_LINK,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// ------------------------------

app.use(express.json());

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;
const RENDER_URL = process.env.RENDER_URL;

const bot = new Telegraf(TOKEN);

let content = {};
try {
  content = JSON.parse(fs.readFileSync("text.json", "utf-8"));
} catch (error) {
  console.error("Error reading or parsing text.json. Using fallback messages.", error.message);
}

bot.start((ctx) => {
  ctx.reply(content.welcomeMessage || "Welcome! Click the button to launch the Mini App.", {
    reply_markup: {
      inline_keyboard: [[{ text: content.goToMiniAppButton || "Launch App", web_app: { url: WEBLINK } }]],
    },
  });
});

bot.on("message", (ctx) => {
  if (ctx.message.forward_from_chat) {
    console.log("Channel ID from forward:", ctx.message.forward_from_chat.id);
  }
});

bot.on("message", (ctx) => {
  console.log("📢 Chat info:", {
    title: ctx.chat.title || "No title (private chat)",
    id: ctx.chat.id,
    type: ctx.chat.type,
  });
});

// Webhook setup //
const BOT_PATH = `/bot${TOKEN}`;
if (RENDER_URL) {
  bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`);
  app.use(bot.webhookCallback(BOT_PATH));
} else {
    console.warn("RENDER_URL not set. Webhook not configured.");
}


// Subscription check endpoint //
app.post("/checkSubscription", async (req, res) => {
  const { userId, channelUsername } = req.body; 

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing userId or channelUsername parameter." });
  }

  try {
    const chatId = channelUsername; 
    const user_id = String(userId);

    const response = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      { params: { chat_id: chatId, user_id: user_id } }
    );

    const result = response.data;
    if (!result.ok) {
        console.error("Telegram API response not OK for getChatMember:", result);
        return res.status(500).json({ success: false, message: "Telegram API error. Is the bot an admin in the channel?" });
    }

    const isMember = ["member", "administrator", "creator"].includes(result.result.status);
    
    return res.json({ 
        success: isMember, 
        message: isMember ? "✅ Subscribed! Energy increased." : "❌ Not subscribed. Please join the channel." 
    });
  } catch (error) {
    // 🔑 IMPROVED ERROR HANDLING: Safely check for the Telegram API error data
    const telegramError = error.response?.data?.description;
    
    if (telegramError) {
        console.error("Telegram API Error:", telegramError);
        return res.status(400).json({ // Return 400 for a Telegram error, not 500
            success: false, 
            message: `Telegram Error: ${telegramError}` 
        });
    }

    // Fallback for network issues or unexpected errors
    console.error("Critical Server Error:", error.message);
    return res.status(500).json({ 
        success: false, 
        message: `Internal Server Error: ${error.message}` 
    });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));