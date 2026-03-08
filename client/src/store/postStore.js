import { create } from "zustand";
import api from "../services/api";

const usePostStore = create((set) => ({

 posts: [],

 fetchPosts: async () => {

  const res = await api.get("/posts");

  set({ posts: res.data });

 },

 createPost: async (title, content) => {

  
  await api.post(
   "/posts",
   { title, content }
  );

 },

 likePost: async (id) => {

  await api.post(
   `/posts/${id}/like`,
   {}
  );

 },

 dislikePost: async (id) => {

  await api.post(
   `/posts/${id}/dislike`,
   {}
  );

 },

 
 addPostRealtime: (post) =>
  set((state) => ({
   posts: [post, ...state.posts]
  })),

 updateLikesRealtime: ({ postId, likes, dislikes }) =>
  set((state) => ({
   posts: state.posts.map((post) =>
    post._id === postId
     ? { ...post, likes: Array(likes), dislikes: Array(dislikes) }
     : post
   )
  }))

}));

export default usePostStore;