const express = require("express");
const axios = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors"); // 1. Import CORS

const app = express();

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;
const RENDER_URL = process.env.RENDER_URL;

// --- 2. CORS CONFIGURATION: Allowing requests from Vercel (WEB_LINK) ---
const allowedOrigins = [
    // This is the URL where your frontend (Mini App) is hosted (Vercel)
    process.env.WEB_LINK, 
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps/Telegram client)
        if (!origin) return callback(null, true); 
        
        // Check if the origin is in our allowed list
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS policy error: Origin ${origin} not allowed.`;
            // Log the error but allow it to proceed if running locally or debugging
            console.warn(msg); 
            // For production safety, uncomment the next line and comment out the two lines below:
            // return callback(new Error(msg), false);
            return callback(null, true); // Temporarily allow all for broader testing/debugging
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// ----------------------------------------------------------------------

app.use(express.json());

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
  bot.telegram.setWebhook(`${RENDER_URL}${BOT_PATH}`).then(() => {
    console.log("Webhook set successfully.");
  }).catch(err => {
    console.error("Failed to set webhook:", err.message);
  });
  app.use(bot.webhookCallback(BOT_PATH));
} else {
    console.warn("RENDER_URL not set. Webhook not configured.");
}

// ---------------------------------------------------
// 3. Subscription check endpoint (Private Channel Fix)
// ---------------------------------------------------
app.post("/checkSubscription", async (req, res) => {
  const { userId, channelUsername } = req.body; // channelUsername is the numeric ID e.g., "-100..."

  if (!userId || !channelUsername) {
    return res.status(400).json({ success: false, message: "Missing userId or channelUsername parameter." });
  }

  try {
    // FIX: Use the channelUsername string directly for private channels
    const chatId = channelUsername; 
    const user_id = String(userId);

    const telegramApiUrl = `https://api.telegram.org/bot${TOKEN}/getChatMember`;
    
    // Using bot.telegram.getChatMember is a cleaner alternative to axios
    const response = await bot.telegram.getChatMember(chatId, user_id);
    
    // The response is already the result object, no need for response.data
    const result = response; 
    
    // Check if the user's status is one of the "member" statuses
    const isMember = ["member", "administrator", "creator"].includes(result.status);
    
    console.log(`Subscription check for User ${userId} in Chat ${chatId}: Status is ${result.status}`);

    return res.json({ 
        success: isMember, 
        message: isMember ? "✅ Subscribed! Max energy increased to 60." : "❌ Not subscribed. Please join the channel first." 
    });
  } catch (error) {
    // Telegraf errors are often descriptive
    const errorMessage = error.response?.description || error.message;
    console.error("Subscription check error:", errorMessage);
    
    let userMessage = "Error checking subscription.";
    if (errorMessage.includes("chat not found")) {
        userMessage = "Configuration Error: Channel ID not found or bot not an admin in the channel.";
    } else if (errorMessage.includes("Bad Request")) {
        userMessage = "Error: Check if the bot is an admin in the channel and the ID is correct.";
    }

    return res.status(500).json({ 
        success: false, 
        message: `${userMessage} (Server error: ${errorMessage})`
    });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));