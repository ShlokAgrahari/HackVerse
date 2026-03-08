import { generateEmbedding } from "./embeddings/geminiEmbedding.js";
import { index } from "./vectorDB/pineconeClient.js";

export async function recommendEvents(userSkills){

 console.log("User query:", userSkills);

 const embedding = await generateEmbedding(userSkills);

 console.log("Embedding length:", embedding.length);

 const results = await index.query({
   vector: embedding,
   topK: 5,
   includeMetadata: true
 });

 console.log("Pinecone results:", results);

 return results.matches;
}