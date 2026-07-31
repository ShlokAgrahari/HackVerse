import {index} from "./vectorDB/pineconeClient.js"
import { generateEmbedding } from "./embeddings/geminiEmbedding.js";

export async function recommendEvents(query){

 const embedding = await generateEmbedding(query);

 const results = await index.query({

  vector:embedding,

  topK:5,

  includeMetadata:true

 });

 return results.matches;

}