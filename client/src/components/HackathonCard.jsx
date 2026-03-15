import { useState, useEffect } from "react";
import api from "../services/api";
import { FiStar } from "react-icons/fi";

function HackathonCard({ hackathon, initiallySaved }) {

 const [saved, setSaved] = useState(initiallySaved);
 const [saving, setSaving] = useState(false);

 useEffect(() => {
  setSaved(initiallySaved);
 }, [initiallySaved]);

 const toggleSave = async () => {

  if(saving) return;

  try{

   setSaving(true);

   await api.post(`/hackathons/${hackathon._id}/save`);

   setSaved(prev => !prev);

  }catch(err){

   console.error("Save error:", err.response?.data);

  }finally{

   setSaving(false);

  }

 };

 return (

  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-purple-500/10 transition flex flex-col justify-between">

   {/* Header */}
   <div className="flex justify-between items-start mb-2">

    <h2 className="text-lg font-semibold text-white">
     {hackathon.title}
    </h2>

    <button
     onClick={toggleSave}
     disabled={saving}
     className={`flex items-center gap-1 text-sm font-medium transition ${
      saved
       ? "text-purple-400"
       : "text-gray-500 hover:text-gray-300"
     }`}
    >
     <FiStar
      className={`text-lg ${
       saved ? "fill-purple-400 text-purple-400" : ""
      }`}
     />

     {saved ? "Saved" : "Save"}

    </button>

   </div>

   {/* Organization */}
   <p className="text-sm text-gray-400 mb-3">
    Organized by{" "}
    <span className="text-purple-400">
     {hackathon.organization}
    </span>
   </p>

   {/* Skills */}
   <div className="flex flex-wrap gap-2 mb-4">
    {hackathon.skills?.map((skill, index) => (
     <span
      key={index}
      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
     >
      {skill}
     </span>
    ))}
   </div>

   {/* Footer */}
   <div className="flex justify-between items-center mt-auto">

    <span className="text-xs text-gray-400">
     Deadline:{" "}
     {hackathon.deadline
      ? new Date(hackathon.deadline).toLocaleDateString()
      : "N/A"}
    </span>

    <a
     href={hackathon.url}
     target="_blank"
     rel="noopener noreferrer"
     className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 rounded text-sm hover:opacity-90 transition"
    >
     View
    </a>

   </div>

  </div>

 );

}

export default HackathonCard;