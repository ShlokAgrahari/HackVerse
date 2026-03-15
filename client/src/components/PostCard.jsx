import { Link } from "react-router-dom";
import usePostStore from "../store/postStore";

function PostCard({ post }) {

 const { likePost, dislikePost } = usePostStore();

 const images = post.images || [];

 return (

  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-purple-500/10 transition">

   <Link to={`/post/${post._id}`}>

    <h2 className="text-lg font-semibold text-white mb-1 hover:text-purple-400 transition">
     {post.title}
    </h2>

   </Link>

   <p className="text-sm text-gray-400 mb-3">
    Posted by <span className="text-purple-400">{post.authorName}</span>
   </p>

   <p className="text-sm text-gray-300 mb-4 line-clamp-3">
    {post.content}
   </p>


   


   <div className="flex items-center justify-between">

    <div className="flex gap-3">

     <button
      onClick={() => likePost(post._id)}
      className="flex items-center gap-1 text-green-400 bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition"
     >
      👍 {post.likes.length}
     </button>

     <button
      onClick={() => dislikePost(post._id)}
      className="flex items-center gap-1 text-red-400 bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition"
     >
      👎 {post.dislikes.length}
     </button>

    </div>

    <Link
     to={`/post/${post._id}`}
     className="text-sm font-medium bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded transition shadow-md shadow-blue-500/20"
    >
     View Post
    </Link>

   </div>

  </div>

 );

}

export default PostCard;
