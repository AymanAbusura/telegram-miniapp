# Telegram Miniapp
A mini-application built for Telegram server-backend + frontend, designed to demonstrate a compact bot/mini-app workflow. It consists of a frontend (React application) hosted on Vercel and a backend (Express server) hosted on Render.

## Table of Contents
* About
* Tech Stack
* Project Structure
* Prerequisites
* Installation
* Configuration
* Running
* Usage
* License
* Screenshots
* Contact

### About
The Telegram MiniApp is a complete small-scale full-stack project comprising:
    * A backend service (API, business logic)
    * A frontend UI (mobile)
    * Integration with Telegram’s bot/mini-app interface
It allows you to quickly spin up a mini-application inside Telegram, handle user interactions, and present UI components via web / embedded views.

### Tech Stack
* Backend: Node.js
* Frontend: React
* Telegram API / Bot API for messaging & UI components
* Deployment: Vercel and onRender
* Languages: JavaScript (≈ 63.8%), CSS (≈ 34.9%), HTML (≈ 1.3%)

### Project Structure
```markdown
project-root/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # Styles
│   │   └── ...
│   └── public/
├── backend/                 # Node.js backend
│   └── index.js           # Express server setup
├── LICENSE                 # Project license
└── README.md               # Project documentation
```

### Prerequisites
* Node.js (v14+ recommended)
* npm
* Telegram Bot token & webhook or long-polling setup
* Hosting account for deployment

### Installation
1. Clone the repo:
```markdown
git clone https://github.com/AymanAbusura/telegram-miniapp.git
cd telegram-miniapp
```

2. Install dependencies:
```markdown
cd backend && npm install  
cd ../frontend && npm install  
```

### Configuration
* In backend/, create a .env (or appropriate config) with:
```markdown
TELEGRAM_BOT_TOKEN=your_bot_token_here  
WEBHOOK_URL=https://yourdomain.com/webhook  
```
* In frontend/, configure the base URL or API endpoint (e.g., REACT_APP_API_URL or equivalent).

### Running
* Start the backend:
```markdown
cd backend  
npm start
```
* Start the frontend:
```markdown
cd frontend  
npm start
```
* Make sure the Telegram bot is configured to either use webhook pointing to your backend or polling.

### Deployment
You can deploy the backend and frontend separately. For example:
* Backend → onRender
* Frontend → Vercel 

### Usage
1. Start the bot in Telegram by sending the /start command or via the UI.
2. The bot opens a web-view (frontend) inside Telegram for richer interaction.

### Screenshots
<img width="621" height="1344" alt="1" src="https://github.com/user-attachments/assets/696d57bf-2dd4-4464-afae-5c66e3ce1831" />
<img width="621" height="1344" alt="2" src="https://github.com/user-attachments/assets/54950fb1-7de9-49b7-9899-ed26057df3e7" />
<img width="621" height="1344" alt="3" src="https://github.com/user-attachments/assets/5231faa1-e2e1-4686-b76c-c3329d67e29b" />
<img width="621" height="1344" alt="4" src="https://github.com/user-attachments/assets/15b252d4-43f5-428b-8966-54e841ee4db1" />
<img width="621" height="1344" alt="5" src="https://github.com/user-attachments/assets/b4a55213-285c-40dd-a8c8-55c19780e9f6" />
<img width="621" height="1344" alt="6" src="https://github.com/user-attachments/assets/a897d342-d624-4360-8a4c-5f4376b1b78f" />
<img width="621" height="1344" alt="7" src="https://github.com/user-attachments/assets/54c75a93-6157-4969-a866-95d547711452" />
<img width="621" height="1344" alt="8" src="https://github.com/user-attachments/assets/546ac224-027a-41f1-9693-60431ea6db4a" />

### License
This project is licensed under the MIT License.

### Contact
Created by Ayman Abusura.
Feel free to reach out via GitHub or email for collaboration or questions.