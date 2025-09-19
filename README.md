# 🌤 Weather Dashboard & Telegram Bot

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)  
[![Vite](https://img.shields.io/badge/Vite-4.5.0-purple?logo=vite)](https://vitejs.dev/)  
[![OpenWeather](https://img.shields.io/badge/OpenWeather-API-orange?logo=openweathermap)](https://openweathermap.org/api)  
[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://core.telegram.org/bots/api)

---

## 📌 Project Overview

A **full-stack weather tracking application** built with React and Node.js that:  

- Tracks weather for multiple cities using **OpenWeather API**  
- Displays **current and historical weather data** (10-year history)  
- Sends **Telegram notifications** for weather updates  
- Provides an **admin panel** for managing cities and notifications  

---

## 🗂 Project Structure

project/
│
├─ server.js # Express backend API
├─ bot.js # Telegram bot integration
├─ package.json
├─ .env # Environment variables
├─ src/ # React frontend source
│ ├─ App.tsx
│ ├─ components/
│ └─ services/
└─ README.md

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd project
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Configure Environment Variables
Create a .env file in the root folder:

env
Copy code
PORT=3001
TELEGRAM_TOKEN=your-telegram-bot-token
OPENWEATHER_API_KEY=your-openweather-api-key
⚠ Keep your Telegram bot token secret.

4️⃣ Run Backend Server
bash
Copy code
node server.js
Runs at: http://localhost:3001

Available API endpoints:

GET /api/cities → List all cities

POST /api/city → Add a city

DELETE /api/city/:id → Delete a city

POST /api/refresh/:id → Refresh city weather

POST /api/notify → Send a notification

GET /api/historical/:cityId → Get historical data

5️⃣ Run Telegram Bot
bash
Copy code
node bot.js
Bot sends weather updates via Telegram

Make sure server.js is running first

🌐 Frontend Setup
Navigate to src/ (React Vite frontend):

bash
Copy code
npm install
npm run dev
Development server: http://localhost:5173

⚡ Deployment
Frontend
Deploy React app on Vercel or Netlify

Backend & Telegram Bot
Deploy on Render, Railway, or any Node.js hosting platform

Update API_BASE_URL in src/services/api.ts with deployed backend URL

📦 Dependencies
Backend

express

cors

dotenv

node-fetch (if using fetch in Node.js)

node-telegram-bot-api

Frontend

react, react-dom

react-router-dom

lucide-react (icons)

vite, typescript

🛠️ Notes
Ensure server.js and bot.js do not run on the same port

Keep .env file secure

Enable CORS properly for frontend-backend communication

For production, use HTTPS

🎨 Screenshots (Optional)
Add screenshots of dashboard, notifications, or Telegram bot interactions here.

📜 License
MIT License © [Your Name]

🔗 Useful Links
OpenWeather API

Telegram Bot API

React Documentation

Vite Documentation

