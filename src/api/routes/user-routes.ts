import { Router } from "express";
import { profileRouter } from "./user/profile-routes.js";
import { fichajeRouter } from "./user/fichajes/fichaje-routes.js";
import { projectRouter } from "./user/project-routes.js";
import { calendarRouter } from "./user/calendar-routes.js";
import { requestsRouter } from "./user/requests-routes.js";

export const userRouter = Router();

userRouter.use(profileRouter);
userRouter.use("/fichajes", fichajeRouter);
userRouter.use(projectRouter);
userRouter.use("/calendar", calendarRouter);
userRouter.use("/requests", requestsRouter);