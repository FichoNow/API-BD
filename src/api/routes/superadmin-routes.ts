import { Router } from "express";
import { patchCompanyController }      from "../controllers/superadmin/patch-company-controller.js";
import { getCompanyController }        from "../controllers/superadmin/get-company-controller.js";
import { postDepartmentController }    from "../controllers/superadmin/post-department-controller.js";
import { patchDepartmentController }   from "../controllers/superadmin/patch-department-controller.js";
import { getSuperadminsController }    from "../controllers/superadmin/get-superadmins-controller.js";
import { postSuperadminController }    from "../controllers/superadmin/post-superadmin-controller.js";

export const superadminRouter = Router();

superadminRouter.get("/company",              getCompanyController);       // Obtener info completa de empresa
superadminRouter.patch("/company",            patchCompanyController);     // Editar empresa propia
superadminRouter.post("/department",          postDepartmentController);   // Crear departamento
superadminRouter.patch("/department/:id",     patchDepartmentController);  // Editar nombre departamento
superadminRouter.get("/superadmins",          getSuperadminsController);   // Listar superadmins
superadminRouter.post("/superadmin",          postSuperadminController);   // Crear superadmin
