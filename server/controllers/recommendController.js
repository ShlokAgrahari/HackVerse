import Hackathon from "../models/Hackathon.js";
import { agentWorkflow } from "../ai/graph/agentGraph.js";
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

export const recommend = async (req, res) => {
 try {

  const { skills } = req.body;

  if (!skills) {
   return res.status(400).json({
    message: "Skills are required"
   });
  }

  const result = await agentWorkflow.invoke({
   query: skills
  });

  console.log("Agent response:", result);

  const vectorEvents = result.events || [];
  const cleanResults = result.result || [];

  const hackathons = [];

  for (let i = 0; i < vectorEvents.length; i++) {

   const vectorEvent = vectorEvents[i];
   const cleanEvent = cleanResults[i];

   let hackathon = null;

   // CASE 1: metadata contains Mongo ID
   if (vectorEvent.metadata?.hackathonId) {

    hackathon = await Hackathon.findById(vectorEvent.metadata.hackathonId);

   }

   // CASE 2: fallback search by title
   if (!hackathon && cleanEvent) {

    hackathon = await Hackathon.findOne({
     title: { $regex: cleanEvent.title, $options: "i" },
     organization: { $regex: cleanEvent.organization || "", $options: "i" }
    });

   }

   // CASE 3: not found in Mongo → send vector result
   if (!hackathon && cleanEvent) {

    hackathons.push({
     _id: null,
     title: cleanEvent.title,
     organization: cleanEvent.organization,
     url: cleanEvent.url,
     skills: cleanEvent.skills,
     deadline: null,
     prize: 0
    });

   } else if (hackathon) {

    hackathons.push(hackathon);

   }

  }

  res.json(hackathons);

 } catch (error) {

  console.error("Recommendation error:", error);

  res.status(500).json({
   error: "Recommendation failed"
  });

 }
};
