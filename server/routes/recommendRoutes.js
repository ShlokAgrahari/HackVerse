import express from "express";
import { recommend } from "../controllers/recommendController.js";

const recommendRoutes=express.Router();

recommendRoutes.post("/",recommend);

export default recommendRoutes;