import { useState, useEffect } from "react";

import api from "../services/api";

import {
 FiStar,
 FiCalendar,
 FiX
} from "react-icons/fi";

function HackathonCard({
 hackathon,
 initiallySaved
}) {

 const [saved,setSaved] =
  useState(initiallySaved);

 const [saving,setSaving] =
  useState(false);

 const [showPopup,setShowPopup] =
  useState(false);

 useEffect(()=>{

  setSaved(initiallySaved);

 },[initiallySaved]);

 const toggleSave = async ()=>{

  if(saving) return;

  try{

   setSaving(true);

   await api.post(
    `/hackathons/${hackathon._id}/save`
   );

   const newSaved = !saved;

   setSaved(newSaved);

   // show popup only after save
   if(newSaved){
    setShowPopup(true);
   }

  }catch(err){

   console.log(err);

  }finally{

   setSaving(false);

  }

 };

 const connectGoogleCalendar =
  async ()=>{

   try{

    // save selected hackathon
    localStorage.setItem(
     "calendarHackathonId",
     hackathon._id
    );

    // axios automatically sends JWT
    const res = await api.get(
     "/google/login"
    );

    // redirect to google oauth
    window.location.href =
     res.data.url;

   }catch(err){

    console.log(err);

   }

 };

 return (

  <>
   <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">

    {/* HEADER */}
    <div className="flex justify-between items-start mb-3">

     <h2 className="text-lg font-semibold text-white leading-snug">

      {hackathon.title}

     </h2>

     <button
      onClick={toggleSave}
      disabled={saving}
      className={`flex items-center gap-1 text-sm transition ${
       saved
        ? "text-purple-400"
        : "text-gray-500 hover:text-gray-300"
      }`}
     >

      <FiStar
       className={`text-lg ${
        saved
         ? "fill-purple-400"
         : ""
       }`}
      />

      {saved ? "Saved" : "Save"}

     </button>

    </div>

    {/* ORGANIZATION */}
    <p className="text-sm text-gray-400 mb-4">

     Organized by{" "}

     <span className="text-purple-400">

      {hackathon.organization}

     </span>

    </p>

    {/* SKILLS */}
    <div className="flex flex-wrap gap-2 mb-5">

     {hackathon.skills?.map(
      (skill,index)=>(
       <span
        key={index}
        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md"
       >
        {skill}
       </span>
      )
     )}

    </div>

    {/* FOOTER */}
    <div className="flex justify-between items-center mt-auto">

     <span className="text-xs text-gray-400">

      Deadline:{" "}

      {hackathon.deadline
       ? new Date(
          hackathon.deadline
         ).toLocaleDateString()
       : "N/A"}

     </span>

     <a
      href={hackathon.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition"
     >
      View
     </a>

    </div>

   </div>

   {/* POPUP */}
   {showPopup && (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

     <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-[90%] max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">

      {/* CLOSE */}
      <button
       onClick={()=>
        setShowPopup(false)
       }
       className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >

       <FiX size={20} />

      </button>

      {/* ICON */}
      <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-5">

       <FiCalendar
        className="text-purple-400"
        size={30}
       />

      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center text-white mb-3">

       Add to Google Calendar?

      </h2>

      {/* DESCRIPTION */}
      <p className="text-center text-gray-400 text-sm leading-relaxed mb-6">

       Stay updated with deadlines and never miss{" "}

       <span className="text-purple-400 font-medium">

        {hackathon.title}

       </span>

      </p>

      {/* BUTTONS */}
      <div className="flex gap-3">

       <button
        onClick={()=>
         setShowPopup(false)
        }
        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl transition"
       >

        Later

       </button>

       <button
        onClick={
         connectGoogleCalendar
        }
        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
       >

        Connect

       </button>

      </div>

     </div>

    </div>

   )}

  </>

 );

}

export default HackathonCard;