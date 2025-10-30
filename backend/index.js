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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: WEBLINK,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const bot = new Telegraf(TOKEN);

let content = {};
try {
  content = JSON.parse(fs.readFileSync("text.json", "utf-8"));
} catch (error) {
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

const BOT_PATH = `/bot${TOKEN}`;
if (RENDER_URL) {
  bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`);
  app.use(bot.webhookCallback(BOT_PATH));
}

app.post("/checkSubscription", async (req, res) => {
  console.log("Incoming body:", req.body);

  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body is empty or malformed." });
  }

  const { userId, channelUsername } = req.body;

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing userId or channelUsername parameter." });
  }

  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      { params: { chat_id: channelUsername, user_id: String(userId) } }
    );

    const result = response.data;
    if (!result.ok) {
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
        return res.status(400).json({ 
            success: false, 
            message: `Telegram Error: ${telegramErrorDescription}. Make sure the bot is an admin in the channel.` 
        });
    }

    return res.status(500).json({ 
        success: false, 
        message: `Internal Server Error: ${error.message}. Check Render logs.` 
    });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));