// require("dotenv").config();
// const { Telegraf } = require("telegraf");

// const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const WEBLINK = process.env.WEB_LINK;

// if (!TOKEN) {
//   console.error("❌ TELEGRAM_BOT_TOKEN is missing in your .env file!");
//   process.exit(1);
// }

// if (!WEBLINK) {
//   console.error("❌ WEB_LINK is missing in your .env file!");
//   process.exit(1);
// }

// const bot = new Telegraf(TOKEN);

// bot.start((ctx) => {
//   ctx.reply(
//     "📈 Welcome to your first Telegram bot that lets you earn real money! Earn real money and withdraw it to your bank account! Available to everyone!",
//     {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Go to Mini App 🚀",
//               web_app: { url: WEBLINK },
//             },
//           ],
//         ],
//       },
//     }
//   );
// });

// bot.launch()
//   .then(() => console.log("✅ Bot is running..."))
//   .catch((err) => {
//     console.error("❌ Failed to launch bot:", err);
//     process.exit(1);
//   });

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

const { Telegraf } = require("telegraf");
require("dotenv").config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBLINK = process.env.WEB_LINK;

const bot = new Telegraf(TOKEN);

bot.start((ctx) =>
  ctx.reply("Welcome!", {
    reply_markup: {
      inline_keyboard: [[{ text: "Go to Mini App 🚀", web_app: { url: WEBLINK } }]],
    },
  })
);

bot.launch();

app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));