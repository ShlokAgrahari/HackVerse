import { agentWorkflow } from "../ai/graph/agentGraph.js";

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

    console.log("Agent response:", result); // helpful for debugging

    // return events if present, otherwise return whole result
    res.json(result.result || []);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Recommendation failed"
    });
  }
};