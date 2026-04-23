import { Router } from "express";
import { patchUserController } from "../controllers/admin/patch-user-controller.js";
import { createUserController } from "../controllers/admin/create-user-controller.js";
import { createUsersController } from "../controllers/admin/create-users-controller.js";
import { createProjectController } from "../controllers/admin/create-project-controller.js";
import { patchProjectController } from "../controllers/admin/patch-project-controller.js";
import { getOverviewController } from "../controllers/admin/get-overview-controller.js";

export const adminRouter = Router();

adminRouter.get("/overview", getOverviewController); // Info de empresa y departamentos

adminRouter.post("/user", createUserController); // Crear un usuario

adminRouter.post("/users", createUsersController); // Crear varios usuarios

adminRouter.patch("/user/:id", patchUserController); // Editar a un usuario

adminRouter.post("/project", createProjectController); // Crear un proyecto

adminRouter.patch("/project/:id", patchProjectController); // Editar un proyecto
