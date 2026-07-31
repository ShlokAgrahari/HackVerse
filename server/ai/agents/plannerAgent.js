// export async function plannerAgent(state){

//  const query =
//   state.query.toLowerCase();

//  let strategy = "specific";

//  let filters = {};

//  let action = null;

//  if(
//   query.includes("best") ||
//   query.includes("top")
//  ){
//   strategy = "broad";
//  }

//  if(
//   query.includes("online")
//  ){
//   filters.mode = "online";
//  }

//  /* TOOL INTENT */

//  if(
//   query.includes("save") ||
//   query.includes("calendar") ||
//   query.includes("remind")
//  ){
//   action = "calendar";
//  }

//  return {

//   ...state,

//   strategy,

//   filters,

//   action

//  };

// }

import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

const llm =
 new ChatGoogleGenerativeAI({

  model:"gemini-2.5-flash",

  temperature:0

 });

export async function plannerAgent(state){

 const prompt = `
You are a planner agent.

Analyze the user query.

Return ONLY valid JSON.

{
 "strategy":"broad|specific",
 "action":"calendar|null",
 "filters":{
   "mode":"online|offline|null"
 }
}

User Query:
${state.query}
`;

 const response =
  await llm.invoke(prompt);

 let result;

 try{

  result =
   JSON.parse(response.content);

 }catch{

  result = {
   strategy:"specific",
   action:null,
   filters:{}
  };

 }

 return {

  ...state,

  strategy:
   result.strategy,

  action:
   result.action,

  filters:
   result.filters

 };

}