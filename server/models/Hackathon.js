import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({

 title: {
  type: String,
  required: true,
  trim: true
 },

 organization: {
  type: String,
  required: true,
  trim: true
 },

 location: {
  type: String,
  default: "Online"
 },

 mode: {
  type: String,
  enum: ["Online", "Offline", "Hybrid"],
  default: "Online"
 },

 prize: {
  type: Number,
  default: 0
 },

 deadline: {
  type: Date,
  required: true
 },

 url: {
  type: String,
  required: true
 },

 skills: [
  {
   type: String
  }
 ],
 reminderSent:{
  type:Boolean,
  default:false
 }

},
{
 timestamps: true
});

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;
