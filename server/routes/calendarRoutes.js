import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
 createCalendarEvent
}
from "../controllers/calendarController.js";

const calendarRouter =
 express.Router();

calendarRouter.post(

 "/:id",

 authMiddleware,

 createCalendarEvent

);

export default calendarRouter;