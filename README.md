# WhatsApp@me

A full-stack modern messaging application inspired by WhatsApp, with powerful features that go beyond WhatsApp Web. Built using the latest technologies like Next.js, Clerk, Convex, and ZEGOCLOUD, this clone provides real-time chat, video calls, group management, and a fully responsive interface that works flawlessly across devices.

## 🚀 What Makes This Different?

Unlike WhatsApp Web, this clone introduces two key features:

- **🔒 Group Block Feature** – Group admins can block users within the group without removing them. Blocked users can't send messages or join calls until unblocked.
- **📱 Responsive Design** – The UI is fully responsive, making it smooth to use across desktops, tablets, and mobile devices. No QR-code limitations.

## 🔧 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Auth**: Clerk
- **Backend**: Convex (serverless logic and database)
- **Calls**: ZEGOCLOUD for real-time video calls
- **Real-Time**: Webhooks for instant message and presence updates

## ✨ Features

- User sign-up and login via Clerk
- One-on-one and group messaging with real-time updates
- Group video calls with multiple users
- Profile updates with avatars and status
- Dark and light mode toggles
- Emoji picker and media sharing
- Group admin controls: block/unblock users in group
- Fully responsive across all screen sizes

## 📦 Getting Started

### Prerequisites

- Node.js
- Convex account
- Clerk credentials
- ZEGOCLOUD account

### Installation

```bash
git clone https://github.com/your-username/whatsapp-clone.git
cd whatsapp-clone
npm install
```

### Environment Setup
Create a ```.env.local``` file and add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_server_secret
NEXT_PUBLIC_TRANSCRIPTION_UR=transcription_service_url for converting audio to text
```

After setting up an account in clerk and convex, do:
```
npx convex dev
```
This will deploy the convex functions.

### Frontend will be served at: ```http://localhost:3000```

## 🖼️ Preview

[![Preview](https://img.shields.io/badge/Live-Preview-green?style=for-the-badge&logo=vercel)](https://whatsapp-me-red.vercel.app/)

Link is live here.

---

## 🤝 Contributing

[![Contribute](https://img.shields.io/badge/Contributions-Welcome-blue?style=for-the-badge&logo=github)](https://github.com/H9660/whatsapp-me)

Feel free to fork the repo, open issues, or submit pull requests.

---

## 📄 License

[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

### Here is a demo of the app: [Video](https://drive.google.com/file/d/1tEVV6cKnsh29MGgrAVNlU27gYomVuuf4/view)
