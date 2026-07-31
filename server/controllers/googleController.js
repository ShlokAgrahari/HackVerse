import { oauth2Client }
from "../config/googleClient.js";

import User from "../models/User.js";

export const googleLogin = async (req, res) => {

 try {
   console.log("GOOGLE LOGIN HIT");

 console.log("REQ USER:", req.user);
  const userId = req.user._id;

  const url = oauth2Client.generateAuthUrl({

   access_type: "offline",

   prompt: "consent",

   scope: [
    "https://www.googleapis.com/auth/calendar"
   ],

   state: userId.toString()

  });

  res.json({ url });

 } catch (err) {

  console.log("GOOGLE LOGIN ERROR:", err);

  res.status(500).send("Google login failed");

 }

};

export const googleCallback = async (req, res) => {

 try {

  console.log("QUERY:", req.query);

  const { code, state } = req.query;

  if (!code) {
   return res.status(400).send("Authorization code missing");
  }

  const { tokens } =
   await oauth2Client.getToken(code);

  console.log("TOKENS:", tokens);

  oauth2Client.setCredentials(tokens);

  const userId = state;

  console.log("USER ID:", userId);

  const updateData = {

   googleAccessToken:
    tokens.access_token,

   googleTokenExpiry:
    tokens.expiry_date

  };

  if (tokens.refresh_token) {

   updateData.googleRefreshToken =
    tokens.refresh_token;

  }

  const updatedUser =
   await User.findByIdAndUpdate(

    userId,

    updateData,

    {
     new: true
    }

   );

  console.log(
   "UPDATED USER:",
   updatedUser
  );

  res.redirect(
 "http://localhost:5173/dashboard"
);

 } catch (err) {

  console.log(
   "GOOGLE CALLBACK ERROR:",
   err
  );

  res.status(500).send(
   "Google auth failed"
  );

 }

};