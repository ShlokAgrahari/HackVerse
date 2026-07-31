import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY2,
});

export async function retryAgent(state) {
  const retryCount = state.retryCount || 0;

  if (retryCount >= 3) {
    return {
      ...state,
      maxRetriesReached: true,
    };
  }

  const prompt = `
Original Query:
${state.query}

Retry Number:
${retryCount + 1}/3

Strategy:
${state.strategy}

Rules:

Retry 1:
- Add closely related terms.

Retry 2:
- Add broader hackathon and competition terms.

Retry 3:
- Maximize recall using all relevant synonyms.

Requirements:
- Preserve original intent.
- Return ONLY the rewritten query.
`;

  let rewrittenQuery;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    rewrittenQuery = response.text.trim();
  } catch (error) {
    console.error("Retry Agent Error:", error);

    if (retryCount === 0) {
      rewrittenQuery = `${state.query} hackathon`;
    } else if (retryCount === 1) {
      rewrittenQuery = `${state.query} hackathon coding competition`;
    } else {
      rewrittenQuery =
        `${state.query} hackathon coding competition developer challenge innovation challenge`;
    }
  }

  return {
    ...state,
    query: rewrittenQuery,
    retryCount: retryCount + 1,
    maxRetriesReached: false,
  };
}