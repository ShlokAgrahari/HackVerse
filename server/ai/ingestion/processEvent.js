import Hackathon from "../../models/Hackathon.js";   
import { generateEmbedding } from "../embeddings/geminiEmbedding.js";
import { index } from "../vectorDB/pineconeClient.js";

import { generateEmbedding }
from "../embeddings/geminiEmbedding.js";

import { index }
from "../vectorDB/pineconeClient.js";

/* =========================
   PARSE DEADLINE
========================= */

function parseDeadline(deadline){

 if(!deadline) return null;

 const parsed = new Date(deadline);

 if(isNaN(parsed.getTime())){
  return null;
 }

 return parsed;

}

export async function processEvent(event){

 try{

  const normalizedMode =
   event.mode?.toLowerCase() === "offline"
    ? "Offline"
    : event.mode?.toLowerCase() === "online"
    ? "Online"
    : "Hybrid";

  /* =========================
     SAVE TO MONGODB
  ========================= */

  let hackathon = await Hackathon.findOne({

   title:event.title,

   organization:event.organization

  });

  if(!hackathon){

   hackathon = await Hackathon.create({

    title:event.title,

    organization:event.organization,

    location:event.location,

    mode:normalizedMode,

    prize:event.prize,

    deadline:parseDeadline(event.deadline),

    url:event.url,

    skills:event.skills

   });

   console.log(
    "Saved to MongoDB:",
    event.title
   );

  }else{

   console.log(
    "Already exists in MongoDB:",
    event.title
   );

  }

  /* =========================
     GENERATE EMBEDDING
  ========================= */

  const text = `
Hackathon: ${event.title}
Organization: ${event.organization}
Location: ${event.location}
Mode: ${normalizedMode}
Skills: ${(event.skills || []).join(", ")}
Prize: ${event.prize}
`;

  const embedding =
   await generateEmbedding(text);

  /* =========================
     SAFE VECTOR ID
  ========================= */

  const safeId =
   `${event.title || "unknown"}_${
     event.organization || "unknown"
   }`
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toLowerCase();

  /* =========================
     METADATA
  ========================= */

  const metadata = {

   /* IMPORTANT */

   mongoId:hackathon._id.toString(),

   title:event.title || "",

   organization:event.organization || "",

   location:event.location || "",

   mode:normalizedMode || "",

   prize:event.prize || 0,

   // deadline:hackathon.deadline || null,
   deadline: hackathon.deadline
    ? hackathon.deadline.toISOString()
    : "",

   url:event.url || "",

   skills:event.skills || []

  };

  /* =========================
     UPSERT TO PINECONE
  ========================= */


  console.log(metadata);

  await index.upsert({

   records:[
    {

     id:safeId,

     values:embedding,

     metadata

    }
   ]

  });

  console.log("Stored:", safeId);

 }catch(err){

  console.error(
   "Process Event Error:",
   err.message
  );

 }

}