import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

/* CREATE POST */
export const createPost = async (req, res) => {
 try {
  const { title, content } = req.body;

  const post = await Post.create({
   author: req.user._id,
   authorName: req.user.name,
   title,
   content
  });

  const io = req.app.get("io");
  if (io) {
   io.emit("new_post", post);
  }

  res.status(201).json({
   message: "Post created successfully",
   post
  });

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


/* GET ALL POSTS */
export const getPosts = async (req, res) => {
 try {
  const posts = await Post.find().sort({ createdAt: -1 });

  res.json(posts);

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


/* LIKE POST */
export const likePost = async (req, res) => {
 try {

  const post = await Post.findById(req.params.id);

  if (!post) {
   return res.status(404).json({ message: "Post not found" });
  }

  const userId = req.user._id;

  const alreadyLiked = post.likes.some(
   id => id.toString() === userId.toString()
  );

  if (alreadyLiked) {
   post.likes.pull(userId);
  } else {
   post.dislikes.pull(userId);
   post.likes.push(userId);
  }

  await post.save();

  const data = {
   postId: post._id,
   likes: post.likes.length,
   dislikes: post.dislikes.length
  };

  const io = req.app.get("io");
  if (io) {
   io.emit("post_liked", data);
  }

  res.json(data);

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


/* DISLIKE POST */
export const dislikePost = async (req, res) => {
 try {

  const post = await Post.findById(req.params.id);

  if (!post) {
   return res.status(404).json({ message: "Post not found" });
  }

  const userId = req.user._id;

  const alreadyDisliked = post.dislikes.some(
   id => id.toString() === userId.toString()
  );

  if (alreadyDisliked) {
   post.dislikes.pull(userId);
  } else {
   post.likes.pull(userId);
   post.dislikes.push(userId);
  }

  await post.save();

  const data = {
   postId: post._id,
   likes: post.likes.length,
   dislikes: post.dislikes.length
  };

  const io = req.app.get("io");
  if (io) {
   io.emit("post_disliked", data);
  }

  res.json(data);

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


/* ADD COMMENT */
export const addComment = async (req, res) => {
 try {

  const { text } = req.body;

  if (!text || text.trim() === "") {
   return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const comment = await Comment.create({
   postId: req.params.id,
   userId: req.user._id,
   userName: req.user.name,
   text
  });

  const io = req.app.get("io");

  if (io) {
   io.emit("new_comment", {
    postId: comment.postId,
    comment
   });
  }

  res.json(comment);

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


/* GET COMMENTS */
export const getComments = async (req, res) => {
 try {

  const comments = await Comment.find({
   postId: req.params.id
  }).sort({ createdAt: -1 });

  res.json(comments);

 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};