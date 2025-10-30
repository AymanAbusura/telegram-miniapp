const express = require("express");
const axios = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;
const RENDER_URL = process.env.RENDER_URL;

const bot = new Telegraf(TOKEN);

const content = JSON.parse(fs.readFileSync("text.json", "utf-8"));

bot.start((ctx) => {
  ctx.reply(content.welcomeMessage, {
    reply_markup: {
      inline_keyboard: [[{ text: content.goToMiniAppButton, web_app: { url: WEBLINK } }]],
    },
  });
});

// Get private channel ID //
(async () => {
  const chat = await bot.telegram.getChat("@yourchannelusername");
  console.log("Private channel ID:", chat.id);
})();

bot.on("message", (ctx) => {
  if (ctx.message.forward_from_chat) {
    console.log("Channel ID:", ctx.message.forward_from_chat.id);
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
bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`);
app.use(bot.webhookCallback(BOT_PATH));

// Subscription check endpoint //
app.post("/checkSubscription", async (req, res) => {
  const { userId, channelUsername } = req.body;

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const chatId = Number(channelUsername); // IMPORTANT for private channel
    const response = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      { params: { chat_id: chatId, user_id: userId } }
    );

    const result = response.data;
    if (!result.ok) {
      return res.status(500).json({ success: false, message: "Telegram API error" });
    }

    const isMember = ["member", "administrator", "creator"].includes(result.result.status);
    return res.json({ success: isMember, message: isMember ? "User is subscribed" : "User is not subscribed" });
  } catch (error) {
    console.error("Subscription check error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Error checking subscription" });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));