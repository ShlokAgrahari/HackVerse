import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  saveHackathon,
  getSavedHackathons
} from "../controllers/HackathonController.js";

const hackathonRouter = express.Router();

hackathonRouter.post("/:id/save", authMiddleware, saveHackathon);


hackathonRouter.get("/saved", authMiddleware, getSavedHackathons);

export default hackathonRouter;
