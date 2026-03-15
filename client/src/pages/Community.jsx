import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

import usePostStore from "../store/postStore";
import socket from "../socket/socket";

function Community(){

 const { posts, fetchPosts, createPost, addPostRealtime, updateLikesRealtime } =
 usePostStore();

 const [title,setTitle] = useState("");
 const [content,setContent] = useState("");
 const [images, setImages] = useState([]);

 useEffect(()=>{

  fetchPosts();

  socket.on("new_post", (post) => {
  addPostRealtime(post);
 });

 socket.on("post_liked", (data) => {
  updateLikesRealtime(data);
 });

 socket.on("post_disliked", (data) => {
  updateLikesRealtime(data);
 });

  return ()=>{
   socket.off("new_post");
   socket.off("post_liked");
   socket.off("post_disliked");
  }

 },[]);

 const handleCreate = async () => {

 if(!title || !content) return;

 const formData = new FormData();

 formData.append("title", title);
 formData.append("content", content);

 for(let i = 0; i < images.length; i++){
  formData.append("images", images[i]);
 }

 await createPost(formData);

 setTitle("");
 setContent("");
 setImages([]);

};


 return(

  <div className="min-h-screen bg-gray-950 text-white">

   <Navbar/>

   <div className="max-w-3xl mx-auto px-6 py-10">

    <h1 className="text-3xl font-bold mb-8">
     Community Discussions
    </h1>

    {/* Create Post Card */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md mb-8">

     <h2 className="text-lg font-semibold mb-4">
      Create a Post
     </h2>

     <input
      placeholder="Post title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      className="w-full bg-gray-800 border border-gray-700 rounded p-2 mb-3 text-sm focus:outline-none focus:border-purple-500"
     />

     <textarea
      placeholder="Share something with the community..."
      value={content}
      onChange={(e)=>setContent(e.target.value)}
      rows="4"
      className="w-full bg-gray-800 border border-gray-700 rounded p-2 mb-4 text-sm focus:outline-none focus:border-purple-500"
     />

     <div className="flex items-center gap-3 mb-4">

 <label className="flex items-center gap-2 cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg text-sm transition">

  Add Images

  <input
   type="file"
   multiple
   accept="image/*"
   onChange={(e)=>{
    const files = Array.from(e.target.files);

    if(files.length > 5){
     alert("Maximum 5 images allowed");
     return;
    }

    setImages(files);
   }}
   className="hidden"
  />

 </label>

 <span className="text-sm text-gray-400">
  {images.length > 0
   ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
   : "Max 5 images"}
 </span>


</div>


     <button
 onClick={handleCreate}
 className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded text-sm transition"
>
 Create Post
</button>

    </div>

   
    <div className="flex flex-col gap-5">

     {posts.map(post=>(
      <PostCard key={post._id} post={post}/>
     ))}

    </div>

   </div>

  </div>

 );

}

export default Community;