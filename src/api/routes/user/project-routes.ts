import { Router } from "express";
import { getProjectsController } from "../../controllers/user/projects/get-projects-controller.js";

export const projectRouter = Router();

projectRouter.get("/projects", getProjectsController);
