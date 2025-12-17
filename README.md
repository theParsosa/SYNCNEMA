<a href="https://www.coffeebede.com/parsosa"><img class="img-fluid" src="https://coffeebede.ir/DashboardTemplateV2/app-assets/images/banner/default-yellow.svg" /></a>

**Syncnema** is a modern, real-time video synchronization web application tailored for couples and friends to watch movies together remotely.

> **Note:** This project is a serverless refactor of the original [Delplayer](https://github.com/oosmajid/Delplayer). The architecture has been migrated from a monolithic Node.js server to a decoupled **Client (Netlify)** and **Serverless Backend (PartyKit)** structure.

## ✨ Features

- **Theater Mode:** Immersive full-screen experience with an overlay chat.
- **Smart Sync:** Real-time synchronization for both Video files (Blob) and YouTube.
- **Live Chat:** Built-in sidebar chat with toast notifications and emoji support.
- **Free Mode:** Option to decouple sync for unstable connections while keeping live status.
- **Secure & Private:** No database required; connections are ephemeral.

## 🏗 Architecture

- **Frontend:** Vanilla JS + TailwindCSS (Deployed on Netlify/Vercel)
- **Backend:** PartyKit (Cloudflare Durable Objects) for WebSocket signaling.

## 🚀 Getting Started

### 1. Backend Setup (PartyKit)
Navigate to the server directory and deploy your own instance:

```bash
cd server
npm install
npx partykit deploy
```
Copy your new URL (e.g., `host.partykit.dev`).

### 2. Frontend Setup
1. Open `client/index.html`.
2. Find `const PARTYKIT_HOST` config.
3. Replace `'YOUR_PARTYKIT_URL_HERE'` with your URL from step 1.
4. Deploy the `client` folder to any static host.

## 🤝 Credits
- Original idea and initial UI by [oosmajid](https://github.com/oosmajid).
- Refactored, redesigned, and maintained by [ME](https://github.com/theParsosa).

## 📄 License
Distributed under the MIT License.
