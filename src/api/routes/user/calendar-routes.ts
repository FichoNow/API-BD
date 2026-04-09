import { Router } from "express";
import { getMonthCalendarController } from "../../controllers/user/calendar/get-month-calendar-controller.js";

export const calendarRouter = Router();

calendarRouter.get("/", getMonthCalendarController);
