import Hackathon from "../models/Hackathon.js";
import User from "../models/User.js";
import transporter from "../config/mailer.js";

export const checkDeadlines = async () => {

 try {

  const now = new Date();

  const threeHoursLater = new Date(
   now.getTime() + 3 * 60 * 60 * 1000
  );

  console.log("Now:", now);
  console.log("3 hours later:", threeHoursLater);

  const hackathons = await Hackathon.find({
   deadline: {
    $gte: now,
    $lte: threeHoursLater
   },
   reminderSent: false
  });

  console.log("Hackathons found:", hackathons.length);

  for (const hackathon of hackathons) {

   console.log("Checking hackathon:", hackathon.title);

   const users = await User.find({
    savedHackathons: hackathon._id
   });

   console.log("Users found:", users.length);

   if (users.length === 0) {
    console.log("No users saved this hackathon");
    continue;
   }

   for (const user of users) {

    console.log("Sending email to:", user.email);

    await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: user.email,
     subject: `Hackathon Ending Soon: ${hackathon.title}`,
     html: `
      <h2>${hackathon.title}</h2>
      <p>Deadline in less than 3 hours</p>
      <p>Organization: ${hackathon.organization}</p>
      <a href="${hackathon.url}">View Hackathon</a>
     `
    });

   }

   console.log("Emails sent for:", hackathon.title);

   hackathon.reminderSent = true;
   await hackathon.save();

  }

 } catch (err) {

  console.error("Reminder job error:", err);

 }

};