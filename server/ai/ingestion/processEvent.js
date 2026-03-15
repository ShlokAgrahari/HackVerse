import Hackathon from "../../models/Hackathon.js";   // 👈 add this
import { generateEmbedding } from "../embeddings/geminiEmbedding.js";
import { index } from "../vectorDB/pineconeClient.js";

function parseDeadline(deadline) {

 if (!deadline) return new Date();

 const parts = deadline.split("-");

 const lastPart = parts[parts.length - 1].trim();

 const parsed = new Date(lastPart);

 if (isNaN(parsed)) {
  return new Date();
 }

 return parsed;
}


export async function processEvent(event) {


 try {

  const existing = await Hackathon.findOne({
   title: event.title,
   organization: event.organization
  });

  if (!existing) {
   const normalizedMode =
 event.mode?.toLowerCase() === "offline"
  ? "Offline"
  : event.mode?.toLowerCase() === "online"
  ? "Online"
  : "Hybrid";

   await Hackathon.create({
    title: event.title,
    organization: event.organization,
    location: event.location,
    mode: event.normalizedMode,
    prize: event.prize,
    deadline: parseDeadline(event.deadline),
    url: event.url,
    skills: event.skills
   });

   console.log("Saved to MongoDB:", event.title);

  } else {

   console.log("Already exists in MongoDB:", event.title);

  }

 } catch (err) {

  console.error("Mongo save error:", err.message);

 }


 
 const text = `
Hackathon: ${event.title}
Organization: ${event.organization}
Location: ${event.location}
Mode: ${event.mode}
Skills: ${event.skills.join(", ")}
Prize: ${event.prize}
`;

 const embedding = await generateEmbedding(text);

 const safeId = `${event.title || "unknown"}_${event.organization || "unknown"}_${event.deadline || "unknown"}`
  .normalize("NFKD")
  .replace(/[^\x00-\x7F]/g, "")
  .replace(/\s+/g, "_")
  .replace(/[^a-zA-Z0-9_-]/g, "")
  .toLowerCase();

 const metadata = {
  title: event.title || "",
  organization: event.organization || "",
  location: event.location || "",
  mode: event.mode || "",
  prize: event.prize || 0,
  deadline: event.deadline || "",
  url: event.url || "",
  skills: event.skills || []
 };

 await index.upsert({
  records: [
   {
    id: safeId,
    values: embedding,
    metadata
   }
  ]
 });

 console.log("Stored:", safeId);

}
