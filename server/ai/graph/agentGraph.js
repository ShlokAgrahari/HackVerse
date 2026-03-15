import { StateGraph } from "@langchain/langgraph";
import { recommendEvents } from "../recommendEvents.js";


async function planQuery(state) {

  console.log("Planning query...");

  return {
    ...state,
    task: "retrieveEvents"
  };

}


async function retrieveEvents(state) {

  const matches = await recommendEvents(state.query);
  console.log("Retrieve event node",matches);
  return {
    ...state,
    events: matches
  };

}


async function filterEvents(state) {

  const now = new Date();

  const filtered = (state.events || []).filter(event => {

    const deadlineText = event.metadata?.deadline;

    if (!deadlineText) return true;

    const parts = deadlineText.split("-");

    const endDateText = parts.length > 1
      ? parts[1].trim()
      : parts[0].trim();

    const deadline = new Date(endDateText);

    if (isNaN(deadline)) {
      console.log("Invalid deadline format:", deadlineText);
      return true; 
    }

    return deadline > now;
  });

  console.log("filter event node", filtered);

  return {
    ...state,
    events: filtered
  };
}

async function rankEvents(state) {

  const queryWords = state.query.toLowerCase().split(" ");

  const ranked = (state.events || []).map(event => {

    const skillsText = (event.metadata.skills || []).join(" ").toLowerCase();

    let extraScore = 0;

    queryWords.forEach(word => {
      if (skillsText.includes(word)) {
        extraScore += 1;
      }
    });

    return {
      title: event.metadata.title,
      organization: event.metadata.organization,
      url: event.metadata.url,
      skills: event.metadata.skills || [],
      score: event.score + extraScore
    };
  });

  ranked.sort((a, b) => b.score - a.score);

 console.log("Ranked event node",ranked);

  return {
    ...state,
    result: ranked.slice(0, 5) 
  };
}


const graph = new StateGraph({

  channels: {
    query: null,
    events: null,
    result: null
  }

});


graph.addNode("planQuery", planQuery);
graph.addNode("retrieveEvents", retrieveEvents);
graph.addNode("filterEvents", filterEvents);
graph.addNode("rankEvents", rankEvents);


graph.setEntryPoint("planQuery");

graph.addEdge("planQuery", "retrieveEvents");
graph.addEdge("retrieveEvents", "filterEvents");
graph.addEdge("filterEvents", "rankEvents");
graph.addEdge("rankEvents", "__end__");


export const agentWorkflow = graph.compile();