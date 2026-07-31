// import { google } from "googleapis";

// import User from "../../models/User.js";

// import { oauth2Client }
// from "../../config/googleClient.js";

// export async function createCalendarEvent(

//  userId,

//  hackathon

// ){

//  try{

//   const user =
//    await User.findById(userId);

//   oauth2Client.setCredentials({

//    refresh_token:
//     user.googleRefreshToken

//   });

//   const calendar =
//    google.calendar({

//     version:"v3",

//     auth:oauth2Client

//    });

//   const event = {

//    summary:hackathon.title,

//    location:hackathon.location,

//    description:
//     `Hackathon by ${hackathon.organization}`,

//    start:{
//     dateTime:
//      new Date(hackathon.deadline)
//    },

//    end:{
//     dateTime:
//      new Date(
//       new Date(hackathon.deadline)
//        .getTime() + 60*60*1000
//      )
//    }

//   };

//   const response =
//    await calendar.events.insert({

//     calendarId:"primary",

//     requestBody:event

//    });

//   return response.data;

//  }catch(err){

//   console.log(
//    "Calendar Tool Error:",
//    err
//   );

//   return null;

//  }

// }

import { google } from "googleapis";

import User from "../models/User.js";

import { oauth2Client }
from "../config/googleClient.js";

export async function createCalendarEvent(

 userId,

 hackathon

){

console.log("USER ID:", userId);

const user =
 await User.findById(userId);

console.log("USER:", user);
 if(!user?.googleRefreshToken){

  throw new Error(
   "Google not connected"
  );

 }

 oauth2Client.setCredentials({

  refresh_token:
   user.googleRefreshToken

 });

 const calendar =
  google.calendar({

   version:"v3",

   auth:oauth2Client

  });
console.log(
 "DEADLINE:",
 hackathon.deadline
);
let startDate;

if(
 !hackathon.deadline ||
 isNaN(
  new Date(
   hackathon.deadline
  ).getTime()
 )
){

 startDate =
  new Date();

 startDate.setDate(
  startDate.getDate() + 1
 );

}else{

 startDate =
  new Date(
   hackathon.deadline
  );

}

 const endDate =
   new Date(
     startDate.getTime()
     + 60*60*1000
   );

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

   requestBody:{

    summary:
      hackathon.title,

    location:
      hackathon.location,

    description:
      hackathon.organization,

    start:{
      dateTime:
       startDate.toISOString()
    },

    end:{
      dateTime:
       endDate.toISOString()
    }

   }

  });

  console.log(
 "EVENT CREATED:",
 response.data
);

 return response.data;

}