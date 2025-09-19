import express from "express";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8000;

// === Load secrets from .env ===
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_BOT_TOKEN";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_KEY";

// === Start Telegram Bot ===
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Store subscribed users and their cities
let userSubscriptions = {}; 
// Example: { chatId: ["Bengaluru", "Delhi"] }

// === Helper function to fetch weather ===
async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      return `❌ Could not fetch weather for ${city}`;
    }

    return `🌤 Weather in ${data.name}:
🌡 Temp: ${data.main.temp}°C
💧 Humidity: ${data.main.humidity}%
🌬 Wind: ${data.wind.speed} m/s
☁ Condition: ${data.weather[0].description}`;
  } catch (err) {
    console.error(err);
    return "⚠ Error fetching weather.";
  }
}

// === Bot commands ===

// /start → Welcome
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Hello ${msg.chat.first_name}!
I can send you weather updates. Use:
- /addcity <cityname> to subscribe
- /removecity <cityname> to unsubscribe
- /mycities to see your list
- /weather <cityname> to get instant weather`);
});

// /addcity <city>
bot.onText(/\/addcity (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1].trim();

  if (!userSubscriptions[chatId]) userSubscriptions[chatId] = [];
  if (!userSubscriptions[chatId].includes(city)) {
    userSubscriptions[chatId].push(city);
    bot.sendMessage(chatId, `✅ Added ${city} to your subscription list!`);
  } else {
    bot.sendMessage(chatId, `ℹ️ ${city} is already in your list.`);
  }
});

// /removecity <city>
bot.onText(/\/removecity (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1].trim();

  if (userSubscriptions[chatId]) {
    userSubscriptions[chatId] = userSubscriptions[chatId].filter(c => c !== city);
    bot.sendMessage(chatId, `🗑 Removed ${city} from your list.`);
  } else {
    bot.sendMessage(chatId, "❌ You don't have any subscriptions yet.");
  }
});

// /mycities → list
bot.onText(/\/mycities/, (msg) => {
  const chatId = msg.chat.id;
  const cities = userSubscriptions[chatId] || [];
  if (cities.length === 0) {
    bot.sendMessage(chatId, "❌ You have no subscribed cities.");
  } else {
    bot.sendMessage(chatId, `📍 Your cities: ${cities.join(", ")}`);
  }
});

// /weather <city>
bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1].trim();

  const weather = await getWeather(city);
  bot.sendMessage(chatId, weather);
});

// === Auto push updates every 1 hour ===
setInterval(async () => {
  for (const chatId in userSubscriptions) {
    for (const city of userSubscriptions[chatId]) {
      const weather = await getWeather(city);
      bot.sendMessage(chatId, `⏰ Hourly Update:\n${weather}`);
    }
  }
}, 60 * 60 * 1000); // every 1 hour

// === Express basic server ===
app.get("/", (req, res) => {
  res.send("Weather Bot server is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
