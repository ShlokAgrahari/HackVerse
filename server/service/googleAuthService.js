import { oauth2Client }
from "../config/googleClient.js";

export function getGoogleAuthUrl(userId){

 return oauth2Client.generateAuthUrl({

  access_type:"offline",

  prompt:"consent",

  scope:[
   "https://www.googleapis.com/auth/calendar"
  ],

  state:userId.toString()

 });

}