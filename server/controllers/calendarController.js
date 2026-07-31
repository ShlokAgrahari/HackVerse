import { google } from "googleapis";

import User from "../models/User.js";

import Hackathon from "../models/Hackathon.js";

export const createCalendarEvent =
 async (req,res)=>{

 try{

  const userId = req.user._id;

  const hackathonId =
   req.params.id;

  // get user
  const user =
   await User.findById(userId);

  if(
   !user.googleRefreshToken
  ){

   return res.status(400).json({
    message:
     "Google account not connected"
   });

  }

  // get hackathon
  const hackathon =
   await Hackathon.findById(
    hackathonId
   );

  if(!hackathon){

   return res.status(404).json({
    message:"Hackathon not found"
   });

  }

  // create oauth client
  const oauth2Client =
   new google.auth.OAuth2(

    process.env.GOOGLE_CLIENT_ID,

    process.env.GOOGLE_CLIENT_SECRET,

    process.env.GOOGLE_REDIRECT_URI

   );

  oauth2Client.setCredentials({

   access_token:
    user.googleAccessToken,

   refresh_token:
    user.googleRefreshToken

  });

  // calendar api
  const calendar =
   google.calendar({

    version:"v3",

    auth:oauth2Client

   });

  /* =========================
     START + END TIME
  ========================= */
  console.log(
 "DEADLINE:",
 hackathon.deadline
);
  let startDate =
   hackathon.deadline
    ? new Date(hackathon.deadline)
    : new Date();

  startDate.setHours(10);
  startDate.setMinutes(0);

  let endDate =
   new Date(startDate);

  endDate.setHours(
   startDate.getHours() + 1
  );

  /* =========================
     EVENT
  ========================= */

  const event = {

   summary:
    hackathon.title,

   location:
    hackathon.location || "",

   description: `
Organization:
${hackathon.organization}

Mode:
${hackathon.mode}

Prize:
${hackathon.prize}

Hackathon Link:
${hackathon.url}
`,

   start:{
    dateTime:
     startDate.toISOString(),

    timeZone:
     "Asia/Kolkata"
   },

   end:{
    dateTime:
     endDate.toISOString(),

    timeZone:
     "Asia/Kolkata"
   }

  };

  /* =========================
     CREATE EVENT
  ========================= */
  console.log("Creating event...");

  console.log(
 "HACKATHON DEADLINE:",
 hackathon.deadline
);

console.log(
 "START DATE:",
 startDate
);

  const response =
   await calendar.events.insert({

    calendarId:"primary",

    requestBody:event

   });

   console.log(
 "EVENT CREATED:",
 response.data
);
  res.json({

   success:true,

   eventLink:
    response.data.htmlLink

  });

 }catch(err){

  console.log(
   "CALENDAR ERROR:",
   err
  );

  res.status(500).json({

   message:
    "Failed to create event"

  });

 }

};