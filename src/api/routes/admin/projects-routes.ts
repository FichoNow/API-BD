import { Router } from "express";
import { createProjectController } from "../../controllers/admin/projects/create-project-controller.js";
import { patchProjectController }  from "../../controllers/admin/projects/patch-project-controller.js";
import { getProjectsController } from "../../controllers/admin/projects/get-projects-controller.js";
import { deleteProjectController } from "../../controllers/admin/projects/delete-project-controller.js";

export const projectsRouter = Router();

projectsRouter.get("/projects", getProjectsController); // Listar proyectos de un departamento
projectsRouter.post("/project", createProjectController); // Crear un proyecto
projectsRouter.patch("/project/:id", patchProjectController); // Editar un proyecto
projectsRouter.delete("/project/:id", deleteProjectController); // Eliminar un proyecto
