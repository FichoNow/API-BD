import { Router } from "express";
import { patchUserController } from "../controllers/admin/patch-user-controller.js";

export const adminRouter = Router();

adminRouter.patch("/user/:id", patchUserController);
