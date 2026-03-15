import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import socket from "../socket/socket";

function PostPage(){

 const { id } = useParams();

 const [post,setPost] = useState(null);
 const [comments,setComments] = useState([]);
 const [text,setText] = useState("");

 useEffect(()=>{

 const loadPost = async ()=>{

  const res = await api.get("/posts");
  const found = res.data.find(p=>p._id===id);
  setPost(found);

 };

 const loadComments = async ()=>{

  const res = await api.get(`/posts/${id}/comments`);
  setComments(res.data);

 };

 loadPost();
 loadComments();

 socket.on("new_comment",loadComments);

 return ()=>{
  socket.off("new_comment",loadComments);
 };

},[id]);


 const addComment = async ()=>{

  if(!text) return;

  const token = localStorage.getItem("token");

  await api.post(`/posts/${id}/comment`,
   {text},
   {
    headers:{
     Authorization:`Bearer ${token}`
    }
   }
  );

  setText("");

 };


 if(!post) 
  return (
   <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
    Loading post...
   </div>
  );


 const images = post.images || [];


 return(

  <div className="min-h-screen bg-gray-950 text-white">

   <Navbar/>

   <div className="max-w-3xl mx-auto px-6 py-10">

    {/* Post */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md mb-10">

     <h1 className="text-2xl font-bold mb-2">
      {post.title}
     </h1>

     <p className="text-sm text-gray-400 mb-4">
      Posted by <span className="text-purple-400">{post.authorName}</span>
     </p>

     <p className="text-gray-300 leading-relaxed mb-6">
      {post.content}
     </p>


     {/* Images */}

     {images.length > 0 && (

      <div className={`grid gap-3 ${
       images.length === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}>

       {images.map((img,index)=>(
        <img
         key={index}
         src={img}
         alt="post"
         className={`rounded-lg object-cover w-full ${
          images.length === 1 ? "max-h-[450px]" : "h-60"
         }`}
        />
       ))}

      </div>

     )}

    </div>


    {/* Comment Input */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">

     <h2 className="text-lg font-semibold mb-4">
      Add a Comment
     </h2>

     <textarea
      placeholder="Write a comment..."
      value={text}
      onChange={(e)=>setText(e.target.value)}
      rows="3"
      className="w-full bg-gray-800 border border-gray-700 rounded p-2 mb-3 text-sm resize-none focus:outline-none focus:border-purple-500"
     />

     <div className="flex justify-end">

      <button
       onClick={addComment}
       className="bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-2 rounded text-sm hover:opacity-90 transition"
      >
       Comment
      </button>

     </div>

    </div>


    {/* Comments */}

    <div className="flex flex-col gap-4">

     {comments.map(c=>(

      <div
       key={c._id}
       className="bg-gray-900 border border-gray-800 rounded-lg p-4"
      >

       <div className="flex items-center gap-2 mb-2">

        <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
         {c.userName?.[0]}
        </div>

        <p className="text-sm text-gray-300">
         {c.userName}
        </p>

       </div>

       <p className="text-sm text-gray-400">
        {c.text}
       </p>

      </div>

     ))}

    </div>

   </div>

  </div>

 );

}

export default PostPage;
