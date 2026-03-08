# 🚀 HackVerse

HackVerse is an AI-powered platform that helps developers discover the most relevant hackathons, tech events, and coding competitions.
It uses semantic search and intelligent recommendations to match events based on a user's interests.

The goal of HackVerse is to make it easier for developers to find opportunities to build, learn, and collaborate.

---

## 🌟 Features

* 🔍 **AI Event Recommendations** – Find hackathons based on interests using semantic search
* 🤖 **Agentic AI Workflow** – Uses LangGraph agents to plan and retrieve event results
* ❤️ **Like / Dislike System** – Users can interact with events and personalize recommendations
* 🔐 **Authentication System** – Secure login and signup using JWT
* ⚡ **Fast Frontend** – Built with React + Vite
* 📡 **REST API Backend** – Node.js and Express server
* 🧠 **Vector Search** – Event similarity using embeddings and Pinecone

---

## 🏗️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Zustand (State Management)
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### AI / Search

* LangGraph
* GEMINI Embeddings
* Pinecone Vector Database

---

## 📂 Project Structure

```
HackVerse
│
├── client/                 # React Frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── store
│
├── server/                 # Backend API
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── agents
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/hackverse.git
cd hackverse
```

---

### 1️⃣ Backend Setup

```
cd server
npm install
```

Create a `.env` file inside the **server** folder.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key
```

Run the backend

```
npm run dev
```

---

### 2️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

The backend requires the following environment variables.

| Variable         | Description                  |
| ---------------- | ---------------------------- |
| PORT             | Backend server port          |
| MONGO_URI        | MongoDB database connection  |
| JWT_SECRET       | Secret for authentication    |
| GEMINI_API_KEY   | GEMINI API key               |
| PINECONE_API_KEY | Pinecone vector database key |

---

## 🧠 How AI Recommendations Work

1. User enters a query for events.
2. The system converts the query into embeddings.
3. Pinecone performs semantic search on stored events.
4. LangGraph agent retrieves and formats the best matches.
5. Results are returned to the frontend.

---

## 👨‍💻 Author

**Shlok Agrahari**

If you like this project, consider giving it a ⭐ on GitHub!
