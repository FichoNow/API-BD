import { Router } from "express";
import { patchCompanyController }    from "../controllers/superadmin/patch-company-controller.js";
import { postDepartmentController }  from "../controllers/superadmin/post-department-controller.js";

export const superadminRouter = Router();

superadminRouter.patch("/company",    patchCompanyController);   // Editar empresa propia
superadminRouter.post("/department",  postDepartmentController); // Crear departamento
