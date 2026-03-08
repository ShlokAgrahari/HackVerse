import { generateEmbedding } from "../embeddings/geminiEmbedding.js";
import { index } from "../vectorDB/pineconeClient.js";

export async function processEvent(event) {

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