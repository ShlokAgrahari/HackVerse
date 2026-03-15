import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HackathonCard from "../components/HackathonCard";
import api from "../services/api";

function SavedHackathons(){

 const [savedHackathons,setSavedHackathons] = useState([]);
 const [loading,setLoading] = useState(true);

 useEffect(()=>{

  const fetchSaved = async()=>{

   try{

    const res = await api.get("/hackathons/saved");

    setSavedHackathons(res.data);

   }catch(err){

    console.error("Error fetching saved hackathons",err);

   }finally{
    setLoading(false);
   }

  };

  fetchSaved();

 },[]);

 return(

  <div className="min-h-screen bg-gray-950 text-white">

   <Navbar/>

   <div className="max-w-6xl mx-auto px-6 py-10">

    <h1 className="text-3xl font-bold mb-2">
     Saved Hackathons
    </h1>

    <p className="text-gray-400 mb-8">
     Hackathons you bookmarked
    </p>

    {loading && (
     <p className="text-gray-400">
      Loading saved hackathons...
     </p>
    )}

    {!loading && savedHackathons.length === 0 && (
     <p className="text-gray-500">
      No saved hackathons yet.
     </p>
    )}

    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

     {savedHackathons.map((hackathon)=>(
      <HackathonCard
       key={hackathon._id}
       hackathon={hackathon}
       initiallySaved={true}
      />
     ))}

    </div>

   </div>

  </div>

 );

}

export default SavedHackathons;