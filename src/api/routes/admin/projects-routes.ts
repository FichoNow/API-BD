import { Router } from "express";
import { createProjectController } from "../../controllers/admin/projects/create-project-controller.js";
import { patchProjectController }  from "../../controllers/admin/projects/patch-project-controller.js";

export const projectsRouter = Router();

projectsRouter.post("/project",      createProjectController);
projectsRouter.patch("/project/:id", patchProjectController);
