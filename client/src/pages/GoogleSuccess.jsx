import { useEffect,useState }
from "react";

import api
from "../services/api";

import {
 FiCheckCircle
}
from "react-icons/fi";

function GoogleSuccess(){

 const [loading,setLoading] =
  useState(true);

 const [eventLink,setEventLink] =
  useState("");

 useEffect(()=>{

  const createEvent =
   async ()=>{

   try{

    const hackathonId =
     localStorage.getItem(
      "calendarHackathonId"
     );

    if(!hackathonId){
     return;
    }

    const res =
     await api.post(
      `/hackathons/${hackathonId}/calendar`
     );

    setEventLink(
     res.data.eventLink
    );

    localStorage.removeItem(
     "calendarHackathonId"
    );

   }catch(err){

    console.log(err);

   }finally{

    setLoading(false);

   }

  };

  createEvent();

 },[]);

 return (

  <div className="min-h-screen bg-black flex items-center justify-center px-4">

   <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">

    <div className="flex justify-center mb-5">

     <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">

      <FiCheckCircle
       className="text-green-400"
       size={42}
      />

     </div>

    </div>

    {loading ? (

     <>
      <h2 className="text-2xl font-bold text-white mb-3">

       Creating Event...

      </h2>

      <p className="text-gray-400">

       Please wait while we add
       your hackathon to Google
       Calendar.

      </p>
     </>

    ) : (

     <>
      <h2 className="text-2xl font-bold text-white mb-3">

       Event Added 🎉

      </h2>

      <p className="text-gray-400 mb-6">

       Your hackathon was added
       successfully to Google
       Calendar.

      </p>

      {eventLink && (

       <a
        href={eventLink}
        target="_blank"
        rel="noreferrer"
        className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
       >
        Open Event
       </a>

      )}
     </>

    )}

   </div>

  </div>

 );

}

export default GoogleSuccess;