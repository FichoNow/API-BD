import { Router } from "express";
import { patchUserController } from "../controllers/admin/patch-user-controller.js";
import { createUserController } from "../controllers/admin/create-user-controller.js";
import { createUsersController } from "../controllers/admin/create-users-controller.js";
import { createProjectController } from "../controllers/admin/create-project-controller.js";
import { patchProjectController } from "../controllers/admin/patch-project-controller.js";
import { getCompanyInfoController } from "../controllers/admin/get-overview-controller.js";
import { getUsersController } from "../controllers/admin/get-users-controller.js";

export const adminRouter = Router();

adminRouter.get("/company-info", getCompanyInfoController); // Info de empresa y departamentos

adminRouter.get("/users", getUsersController); // Listar usuarios de un departamento

adminRouter.post("/user", createUserController); // Crear un usuario

adminRouter.post("/users", createUsersController); // Crear varios usuarios

adminRouter.patch("/user/:id", patchUserController); // Editar a un usuario

adminRouter.post("/project", createProjectController); // Crear un proyecto

adminRouter.patch("/project/:id", patchProjectController); // Editar un proyecto
