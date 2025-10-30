const express = require("express");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const content = JSON.parse(fs.readFileSync("text.json", "utf-8"));

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
  ctx.reply(content.welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: content.goToMiniAppButton, web_app: { url: WEBLINK } }],
      ],
    },
  });
});

bot.launch().then(() => console.log("Telegram bot launched ✅"));

app.get("/check-subscription/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const member = await bot.telegram.getChatMember(CHANNEL_ID, userId);
    const isSubscribed = ["creator", "administrator", "member"].includes(member.status);
    res.json({ subscribed: isSubscribed });
  } catch (err) {
    console.error("Error checking subscription:", err.description || err.message);
    res.json({ subscribed: false, error: "Bot cannot access member list. Make sure bot is admin." });
  }
});

let cachedChannelInfo = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (adjust if needed)

app.get("/channel-info", async (req, res) => {
  const now = Date.now();

  // ✅ If cache exists and is still valid — return it instantly
  if (cachedChannelInfo && now - lastFetched < CACHE_DURATION) {
    return res.json(cachedChannelInfo);
  }

  try {
    const chat = await bot.telegram.getChat(process.env.TELEGRAM_CHANNEL_ID);
    const fileId = chat.photo?.big_file_id || chat.photo?.small_file_id;
    let photoUrl = null;

    if (fileId) {
      const file = await bot.telegram.getFileLink(fileId);
      photoUrl = file.href;
    }

    cachedChannelInfo = {
      title: chat.title,
      description: chat.description || content.emptyDescription,
      photo: photoUrl,
    };

    lastFetched = now;

    res.json(cachedChannelInfo);
  } catch (err) {
    console.error("Error fetching channel info:", err);
    res.status(500).json({ error: "Failed to fetch channel info" });
  }
});

(async () => {
  try {
    const chat = await bot.telegram.getChat(process.env.TELEGRAM_CHANNEL_ID);
    const fileId = chat.photo?.big_file_id || chat.photo?.small_file_id;
    let photoUrl = null;
    if (fileId) {
      const file = await bot.telegram.getFileLink(fileId);
      photoUrl = file.href;
    }
    cachedChannelInfo = {
      title: chat.title,
      description: chat.description || content.emptyDescription,
      photo: photoUrl,
    };
    lastFetched = Date.now();
    console.log("✅ Channel info preloaded at startup");
  } catch (err) {
    console.warn("⚠️ Failed to preload channel info:", err.message);
  }
})();


app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));