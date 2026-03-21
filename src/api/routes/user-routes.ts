import { Router } from "express";
import { patchSelfController } from "../controllers/user/patch-user-controller.js";

export const userRouter = Router();

userRouter.patch("/update", patchSelfController);
