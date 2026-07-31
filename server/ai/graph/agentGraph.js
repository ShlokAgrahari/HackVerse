import {
  StateGraph,
  Annotation
} from "@langchain/langgraph";

import { plannerAgent } from "../agents/plannerAgent.js";
import { evaluatorAgent } from "../agents/evaluatorAgent.js";
import { retryAgent } from "../agents/retryAgent.js";

import { recommendEvents } from "../recommendEvents.js";
import { filterEvents } from "../filtering/filterEvents.js";
import { rankEvents } from "../ranking/rankEvents.js";

import { toolDecisionAgent } from "../agents/toolDecisionAgent.js";
import { calendarTool } from "../tools/calendarTool.js";

const GraphState = Annotation.Root({
  query: Annotation(),
  userId: Annotation(),
  strategy: Annotation(),
  filters: Annotation(),

  events: Annotation(),
  rankedResults: Annotation(),

  shouldRetry: Annotation(),
  retryCount: Annotation(),

  selectedEvent: Annotation(),

  action: Annotation(),
  toolName: Annotation(),
  toolResult: Annotation(),

  finalResults: Annotation(),
});

async function retrieveEvents(state) {
  console.log("Retrieve Node");

  const query =
    state.strategy === "broad"
      ? `${state.query} hackathon coding competition`
      : state.query;

  console.log("Final Query:", query);

  const results = await recommendEvents(query);

  console.log("Retrieved Events:", results?.length || 0);

  return {
    ...state,
    events: results || [],
  };
}

async function formatResults(state) {
  console.log("Formatting Results");

  const formatted = (state.rankedResults || []).map((event) => ({
    _id: event.metadata?.mongoId || event.id,

    title: event.metadata?.title || "Untitled",

    organization:
      event.metadata?.organization || "Unknown",

    location:
      event.metadata?.location || "Online",

    deadline:
      event.metadata?.deadline || null,

    url:
      event.metadata?.url || "",

    mode:
      event.metadata?.mode || "",

    skills:
      event.metadata?.skills || [],

    score:
      event.finalScore ||
      event.score ||
      0,
  }));

  console.log(
    "Final Results:",
    formatted.length
  );

  return {
    ...state,
    finalResults: formatted,
  };
}

const graph = new StateGraph(GraphState);

graph.addNode("planner", plannerAgent);
graph.addNode("retrieve", retrieveEvents);
graph.addNode("filter", filterEvents);
graph.addNode("rank", rankEvents);
graph.addNode("evaluate", evaluatorAgent);
graph.addNode("retry", retryAgent);
graph.addNode("format", formatResults);

graph.addNode(
  "toolDecision",
  toolDecisionAgent
);

graph.addNode(
  "calendarTool",
  calendarTool
);

graph.setEntryPoint("planner");

graph.addEdge(
  "planner",
  "retrieve"
);

graph.addEdge(
  "retrieve",
  "filter"
);

graph.addEdge(
  "filter",
  "rank"
);

graph.addEdge(
  "rank",
  "toolDecision"
);

graph.addConditionalEdges(
  "toolDecision",

  (state) => {
    if (
      state.toolName ===
      "calendar"
    ) {
      return "calendarTool";
    }

    return "evaluate";
  },

  {
    calendarTool:
      "calendarTool",

    evaluate:
      "evaluate",
  }
);

graph.addEdge(
  "calendarTool",
  "evaluate"
);

graph.addConditionalEdges(
  "evaluate",

  (state) => {
    console.log(
      "Evaluate Node:",
      state.shouldRetry
    );

    if (
      state.shouldRetry &&
      (state.retryCount || 0) < 2
    ) {
      return "retry";
    }

    return "format";
  },

  {
    retry: "retry",
    format: "format",
  }
);

graph.addEdge(
  "retry",
  "retrieve"
);

graph.addEdge(
  "format",
  "__end__"
);

export const agentWorkflow =
  graph.compile();