import { Router } from "express";
import { patchSelfController } from "../controllers/user/patch-user-controller.js";
import { logoutController } from "../controllers/user/delete-logout-controller.js";

export const userRouter = Router();

userRouter.patch("/update", patchSelfController);
userRouter.delete("/logout", logoutController);
