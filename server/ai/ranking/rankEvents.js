export async function rankEvents(state){

 const query = state.query.toLowerCase();

 const ranked = state.events.map(event=>{

  let boost = 0;

  const skills = (
   event.metadata.skills || []
  ).join(" ").toLowerCase();

  if(query.includes("ai") && skills.includes("ai")){
   boost += 1;
  }

  if(
   query.includes("machine learning") &&
   skills.includes("machine learning")
  ){
   boost += 1;
  }

  if(
   query.includes("python") &&
   skills.includes("python")
  ){
   boost += 1;
  }

  return {

   ...event,

   finalScore:event.score + boost

  };

 });

 ranked.sort((a,b)=> b.finalScore - a.finalScore);

 return {

  ...state,

  rankedResults:ranked

 };

}