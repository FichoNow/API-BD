import { Router } from "express";
import { patchUserController } from "../controllers/admin/patch-user-controller.js";
import { createUserController } from "../controllers/admin/create-user-controller.js";
import { createUsersController } from "../controllers/admin/create-users-controller.js";

export const adminRouter = Router();

adminRouter.patch("/user/:id", patchUserController);

adminRouter.post("/user", createUserController);
adminRouter.post("/users", createUsersController);
