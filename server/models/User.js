import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name: {
  type: String,
  required: true
 },

 email: {
  type: String,
  required: true,
  unique: true
 },

 phone: {
  type: String,
  required: true
 },

 password: {
  type: String,
  required: true
 },
 savedHackathons: [
 {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Hackathon"
 }
],

 createdAt: {
  type: Date,
  default: Date.now
 },
 profilePic: {
    type: String,
    default: "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"
  }
})

export default mongoose.model("User", userSchema);