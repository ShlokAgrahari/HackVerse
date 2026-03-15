import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },

 authorName: {
  type: String
},

 title: {
  type: String,
  required: true
 },

 content: {
  type: String,
  required: true
 },

 likes: [
  {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
  }
 ],

 dislikes: [
  {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
  }
 ],
 images:[
 {
  type:String
 }
],
 createdAt: {
  type: Date,
  default: Date.now
 }

});

export default mongoose.model("Post", postSchema);