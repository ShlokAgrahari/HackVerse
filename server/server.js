import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import recommendRoutes from "./routes/recommendRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import { crawlHackathons } from "./ai/ingestion/crawler.js";
import { checkDeadlines } from "./scripts/reminderJob.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/hackathons", hackathonRoutes);

const server = http.createServer(app);

const io = new Server(server, {
 cors: { origin: "*" }
});

io.on("connection", (socket) => {

 console.log("User connected:", socket.id);

 socket.on("disconnect", () => {
  console.log("User disconnected");
 });

});

app.set("io", io);

async function startCrawler(){

 try{

  console.log("Fetching hackathons...");

  await crawlHackathons();

  console.log("Hackathons updated");

 }catch(err){

  console.error("Crawler failed:", err.message);

 }

}

cron.schedule("*/1 * * * *", async ()=>{

 console.log("Checking hackathon deadlines...");

 await checkDeadlines();

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {

 console.log(`Server running on port ${PORT}`);

 await startCrawler();

});