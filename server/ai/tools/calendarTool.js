import Hackathon from "../../models/Hackathon.js";
import User from "../../models/User.js";

import {
 getGoogleAuthUrl
}
from "../../service/googleAuthService.js";
import {
  createCalendarEvent
} from "../../service/googleCalendarService.js";

export async function calendarTool(state){

 try{

  console.log(
   "Calendar Tool Started"
  );
  console.log(
 "SELECTED EVENT:",
 state.selectedEvent
);
  if(
   !state.selectedEvent
  ){

   return state;

  }
  console.log(
 "MONGO ID:",
 state.selectedEvent?.metadata?.mongoId
);
  const hackathon =
   await Hackathon.findById(

    state.selectedEvent.metadata
     ?.mongoId

   );

  if(!hackathon){

   return {

    ...state,

    toolResult:{
     success:false,
     message:
      "Hackathon not found"
    }

   };

  }
  const user =
 await User.findById(
  state.userId
 );

if(
 !user?.googleRefreshToken
){

 const authUrl =
  getGoogleAuthUrl(
   state.userId
  );

 return {

  ...state,

  toolResult:{

   type:"calendar",

   success:false,

   requiresGoogleAuth:true,

   authUrl

  }

 };

}
  const result =
   await createCalendarEvent(

    state.userId,

    hackathon

   );

  return {

   ...state,

   toolResult:{

    type:"calendar",

    success:true,

    eventId:
     result.id,

    eventLink:
     result.htmlLink

   }

  };

 }catch(err){

  console.log(err);

  return {

   ...state,

   toolResult:{

    type:"calendar",

    success:false

   }

  };

 }

}