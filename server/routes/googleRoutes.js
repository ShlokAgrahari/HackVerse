import express from "express";

import {
 googleLogin,
 googleCallback
} from "../controllers/googleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const googleRouter = express.Router();

googleRouter.get(
 "/login",
 authMiddleware,
 googleLogin
);

googleRouter.get("/callback", googleCallback);

export default googleRouter;