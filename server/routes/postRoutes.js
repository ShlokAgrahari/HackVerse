import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createPost,
  getPosts,
  likePost,
  dislikePost,
  addComment,
  getComments
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);

postRouter.post("/", authMiddleware, createPost);

postRouter.post("/:id/like", authMiddleware, likePost);

postRouter.post("/:id/dislike", authMiddleware, dislikePost);

postRouter.post("/:id/comment", authMiddleware, addComment);

postRouter.get("/:id/comments", getComments);

export default postRouter;