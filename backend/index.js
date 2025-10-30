const express = require("express");
const axios = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;

const bot = new Telegraf(TOKEN);
const fs = require("fs");

const content = JSON.parse(fs.readFileSync("text.json", "utf-8"));

bot.start((ctx) =>
  ctx.reply(content.welcomeMessage, {
    reply_markup: {
      inline_keyboard: [[{ text: content.goToMiniAppButton, web_app: { url: WEBLINK } }]],
    },
  })
);

bot.launch();

bot.on("message", (ctx) => {
  console.log("Channel ID:", ctx.chat.id);
});


app.post("/checkSubscription", async (req, res) => {
  const { userId, channelUsername } = req.body;

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      {
        chat_id: `@${channelUsername}`,
        user_id: userId,
      }
    );

    const status = response.data.result.status;
    const isMember = ["member", "administrator", "creator"].includes(status);

    if (isMember) {
      return res.json({ success: true, message: "User is subscribed" });
    } else {
      return res.json({ success: false, message: "User is not subscribed" });
    }
  } catch (error) {
    console.error("Subscription check error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Error checking subscription" });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));