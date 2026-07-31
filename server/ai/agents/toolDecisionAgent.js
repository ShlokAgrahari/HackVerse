export async function toolDecisionAgent(state) {

 console.log("Tool Decision Agent");

 if (
  state.action === "calendar"
 ) {
const bestEvent =
 state.rankedResults?.find(
  event =>
   event.metadata?.deadline &&
   !isNaN(
    new Date(
      event.metadata.deadline
    ).getTime()
   )
 );

return {
 ...state,
 toolName:"calendar",
 selectedEvent:bestEvent
};

 }

 return {

  ...state,

  toolName: null

 };

}