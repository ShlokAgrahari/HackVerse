import express from "express";
import { recommend } from "../controllers/recommendController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const recommendRoutes = express.Router();

recommendRoutes.post(
 "/",
 authMiddleware,
 recommend
);

export default recommendRoutes;