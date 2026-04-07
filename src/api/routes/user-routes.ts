import { Router } from "express";
import { profileRouter } from "./user/profile-routes.js";
import { fichajeRouter } from "./user/fichajes/fichaje-routes.js";
import { projectRouter } from "./user/project-routes.js";

export const userRouter = Router();

userRouter.use(profileRouter);
userRouter.use("/fichajes", fichajeRouter);
userRouter.use(projectRouter);
