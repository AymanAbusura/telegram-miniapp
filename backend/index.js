// const express = require("express");
// const axios = require("axios");
// const { Telegraf } = require("telegraf");
// require("dotenv").config();
// const fs = require("fs");

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 10000;
// const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const WEBLINK = process.env.WEB_LINK;
// const RENDER_URL = process.env.RENDER_URL;

// const bot = new Telegraf(TOKEN);

// const content = JSON.parse(fs.readFileSync("text.json", "utf-8"));

// bot.start((ctx) => {
//   ctx.reply(content.welcomeMessage, {
//     reply_markup: {
//       inline_keyboard: [[{ text: content.goToMiniAppButton, web_app: { url: WEBLINK } }]],
//     },
//   });
// });

// // Get private channel ID //
// (async () => {
//   const chat = await bot.telegram.getChat("@yourchannelusername");
//   console.log("Private channel ID:", chat.id);
// })();

// bot.on("message", (ctx) => {
//   if (ctx.message.forward_from_chat) {
//     console.log("Channel ID:", ctx.message.forward_from_chat.id);
//   }
// });

// bot.on("message", (ctx) => {
//   console.log("📢 Chat info:", {
//     title: ctx.chat.title || "No title (private chat)",
//     id: ctx.chat.id,
//     type: ctx.chat.type,
//   });
// });

// // Webhook setup //
// const BOT_PATH = `/bot${TOKEN}`;
// bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`);
// app.use(bot.webhookCallback(BOT_PATH));

// // Subscription check endpoint //
// app.post("/checkSubscription", async (req, res) => {
//   const { userId, channelUsername } = req.body;

//   if (!userId || !channelUsername) {
//     return res.status(400).json({ success: false, message: "Missing parameters" });
//   }

//   try {
//     const chatId = Number(channelUsername); // IMPORTANT for private channel
//     const response = await axios.get(
//       `https://api.telegram.org/bot${TOKEN}/getChatMember`,
//       { params: { chat_id: chatId, user_id: userId } }
//     );

//     const result = response.data;
//     if (!result.ok) {
//       return res.status(500).json({ success: false, message: "Telegram API error" });
//     }

//     const isMember = ["member", "administrator", "creator"].includes(result.result.status);
//     return res.json({ success: isMember, message: isMember ? "User is subscribed" : "User is not subscribed" });
//   } catch (error) {
//     console.error("Subscription check error:", error.response?.data || error.message);
//     return res.status(500).json({ success: false, message: "Error checking subscription" });
//   }
// });

// app.get("/", (req, res) => res.send("Bot is running ✅"));
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

// Ensure text.json exists and is readable
let content = {};
try {
  content = JSON.parse(fs.readFileSync("text.json", "utf-8"));
} catch (error) {
  console.error("Error reading or parsing text.json:", error.message);
}

bot.start((ctx) => {
  ctx.reply(content.welcomeMessage || "Welcome! Click the button to launch the Mini App.", {
    reply_markup: {
      inline_keyboard: [[{ text: content.goToMiniAppButton || "Launch App", web_app: { url: WEBLINK } }]],
    },
  });
});

// Utility to get the private channel ID (Keep for debugging)
// NOTE: Remember to replace "@yourchannelusername" with the actual public username
// If the channel is strictly private and has no username, this call will fail.
// (async () => {
//   try {
//     const chat = await bot.telegram.getChat("@yourchannelusername");
//     console.log("Private channel ID:", chat.id);
//   } catch (error) {
//     console.log("Could not get chat ID for @yourchannelusername. This is normal if it's a private, link-only channel or the bot is not in it.");
//   }
// })();

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
    console.warn("RENDER_URL not set. Webhook not configured. Bot will rely on polling or external webhook setup.");
}


// Subscription check endpoint //
app.post("/checkSubscription", async (req, res) => {
  const { userId, channelUsername } = req.body; // channelUsername should be like "-100..."

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing userId or channelUsername parameter." });
  }

  try {
    // 🔑 FIX: Use the channelUsername string directly. For private channels, 
    // this must be the numeric ID including the negative prefix (e.g., "-1001234567").
    const chatId = channelUsername; 
    
    // Ensure userId is treated as a string for API call, though Number(userId) is also fine
    const user_id = String(userId);

    const response = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getChatMember`,
      { params: { chat_id: chatId, user_id: user_id } }
    );

    const result = response.data;
    if (!result.ok) {
        // Log the API error response for debugging
        console.error("Telegram API response not OK for getChatMember:", result);
        return res.status(500).json({ success: false, message: "Telegram API error. Check if the bot is an admin in the channel." });
    }

    // Check if the user's status is one of the "member" statuses
    const isMember = ["member", "administrator", "creator"].includes(result.result.status);
    
    // Log the result status for transparency
    console.log(`Subscription check for User ${userId} in Chat ${chatId}: Status is ${result.result.status}`);

    return res.json({ 
        success: isMember, 
        message: isMember ? "✅ Subscribed! Energy increased." : "❌ Not subscribed. Please join the channel." 
    });
  } catch (error) {
    const errorData = error.response?.data || {};
    // Check for specific common Telegram error (e.g., "400 Bad Request: chat not found")
    console.error("Subscription check error:", errorData.description || error.message);
    return res.status(500).json({ 
        success: false, 
        message: `Error checking subscription: ${errorData.description || "Internal Server Error"}` 
    });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));