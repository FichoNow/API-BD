import { Router } from "express";
import { userController } from "../controllers/admin/patch-user-controller.js";

export const adminRouter = Router();

adminRouter.patch("/user", userController);
