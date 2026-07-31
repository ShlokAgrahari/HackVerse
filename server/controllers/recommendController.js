import { agentWorkflow }
from "../ai/graph/agentGraph.js";

export const recommend = async (req,res)=>{

 try{
console.log("REQ.USER =", req.user);
  const { query } = req.body;

  const result = await agentWorkflow.invoke({

   query,
   userId:req.user._id.toString(),
   retryCount:0

  });

  res.json({

 events:
  result.finalResults,

 toolResult:
  result.toolResult

});

 }catch(error){

  console.log(error);

  res.status(500).json({

   error:error.message

  });

 }

};