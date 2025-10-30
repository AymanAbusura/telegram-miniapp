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

bot.on("message", (ctx) => {
  if (ctx.message.forward_from_chat) {
    console.log("Channel info:", ctx.message.forward_from_chat);
  } else {
    console.log("Regular message:", ctx.chat);
  }
});


// PUBLIC CHANNEL
// app.get("/check-subscription/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const member = await bot.telegram.getChatMember(CHANNEL_ID, userId);
//     const isSubscribed = ["creator", "administrator", "member"].includes(member.status);
//     res.json({ subscribed: isSubscribed });
//   } catch (err) {
//     console.error("Error checking subscription:", err.description || err.message);
//     res.json({ subscribed: false, error: "Bot cannot access member list. Make sure bot is admin." });
//   }
// });

// PRIVATE CHANNEL
app.get("/check-subscription/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ subscribed: false, error: "Missing userId" });
  }

  try {
    // Ensure bot is part of the channel
    const member = await bot.telegram.getChatMember(CHANNEL_ID, userId);

    // Possible statuses: "creator", "administrator", "member", "restricted", "left", "kicked"
    const isSubscribed = ["creator", "administrator", "member"].includes(member.status);

    res.json({ subscribed: isSubscribed });
  } catch (err) {
    console.error("Error checking subscription:", err.description || err.message);

    // Telegram-specific errors
    if (err.response && err.response.error_code === 400) {
      res.json({
        subscribed: false,
        error: "Bot cannot access this private channel. Make sure the bot is a member/admin.",
      });
    } else if (err.response && err.response.error_code === 403) {
      res.json({
        subscribed: false,
        error: "User not found in channel. Make sure the user joined the channel first.",
      });
    } else {
      res.json({ subscribed: false, error: "Unknown error while checking subscription." });
    }
  }
});

// PUCLIC CHANNEL
// app.get("/channel-info", async (req, res) => {
//     try {
//         const chat = await bot.telegram.getChat(CHANNEL_ID);
//         const fileId = chat.photo?.big_file_id || chat.photo?.small_file_id;
//         let photoUrl = null;

//         if (fileId) {
//             const file = await bot.telegram.getFileLink(fileId);
//             photoUrl = file.href;
//         }

//         const channelInfo = {
//             title: chat.title,
//             description: chat.description || content.emptyDescription,
//             photo: photoUrl,
//         };

//         res.json(channelInfo);
//     } catch (err) {
//         console.error("Error fetching channel info:", err);
//         res.status(500).json({ error: "Failed to fetch channel info" });
//     }
// });

// PRIVATE CHANNEL
app.get("/channel-info", async (req, res) => {
  try {
    // Get chat info
    const chat = await bot.telegram.getChat(CHANNEL_ID);

    let photoUrl = null;
    if (chat.photo) {
      try {
        // Prefer big photo if available
        const fileId = chat.photo.big_file_id || chat.photo.small_file_id;
        const file = await bot.telegram.getFileLink(fileId);
        photoUrl = file.href;
      } catch (photoErr) {
        console.warn("Could not fetch channel photo:", photoErr.message);
      }
    }

    const channelInfo = {
      title: chat.title || "Untitled Channel",
      description: chat.description || content.emptyDescription,
      photo: photoUrl,
    };

    res.json(channelInfo);
  } catch (err) {
    console.error("Error fetching channel info:", err.description || err.message);

    if (err.response && err.response.error_code === 400) {
      res.status(400).json({
        error:
          "Bot cannot access this private channel. Make sure the bot is a member/admin.",
      });
    } else {
      res.status(500).json({ error: "Failed to fetch channel info" });
    }
  }
});


app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));