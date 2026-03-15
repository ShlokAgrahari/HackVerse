import User from "../models/User.js";
import Hackathon from "../models/Hackathon.js";

export const saveHackathon = async (req,res)=>{

 try{

  console.log("Request received to save hackathon");

  console.log("User ID:", req.user?._id);

  const hackathonId = req.params.id;

  console.log("Hackathon ID:", hackathonId);


  const user = await User.findById(req.user._id);

  console.log("User found:", user?.email);


  if(!user){
   console.log("User not found");
   return res.status(404).json({message:"User not found"});
  }


  console.log("Saved hackathons before:", user.savedHackathons);

  if(!user.savedHackathons){
   user.savedHackathons = [];
  }

  if(user.savedHackathons.includes(hackathonId)){

   console.log("Hackathon already saved → removing");

   user.savedHackathons.pull(hackathonId);

  }else{

   console.log("Hackathon not saved → adding");

   user.savedHackathons.push(hackathonId);

  }


  await user.save();

  console.log("Saved hackathons after:", user.savedHackathons);


  res.json(user.savedHackathons);

 }catch(err){

  console.error("Error in saveHackathon:",err);

  res.status(500).json({error:err.message});

 }

};

export const getSavedHackathons = async (req,res)=>{

 try{

  const user = await User.findById(req.user._id)
   .populate("savedHackathons");

  res.json(user.savedHackathons);

 }catch(err){

  res.status(500).json({error:err.message});

 }

};
