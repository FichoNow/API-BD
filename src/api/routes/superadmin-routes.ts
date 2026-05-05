import { Router } from "express";
import { patchCompanyController }      from "../controllers/superadmin/company/patch-company-controller.js";
import { getCompanyController }        from "../controllers/superadmin/company/get-company-controller.js";
import { postDepartmentController }    from "../controllers/superadmin/department/post-department-controller.js";
import { patchDepartmentController }   from "../controllers/superadmin/department/patch-department-controller.js";
import { getSuperadminsController }    from "../controllers/superadmin/superadmins/get-superadmins-controller.js";
import { postSuperadminController }    from "../controllers/superadmin/superadmins/post-superadmin-controller.js";
import { patchSuperadminController }   from "../controllers/superadmin/superadmins/patch-superadmin-controller.js";
import { deleteSuperadminController }  from "../controllers/superadmin/superadmins/delete-superadmin-controller.js";

export const superadminRouter = Router();

superadminRouter.get("/company",              getCompanyController);       // Obtener info completa de empresa
superadminRouter.patch("/company",            patchCompanyController);     // Editar empresa propia
superadminRouter.post("/department",          postDepartmentController);   // Crear departamento
superadminRouter.patch("/department/:id",     patchDepartmentController);  // Editar nombre departamento
superadminRouter.get("/superadmins",          getSuperadminsController);   // Listar superadmins
superadminRouter.post("/superadmin",          postSuperadminController);   // Crear superadmin
superadminRouter.patch("/superadmin/:id",     patchSuperadminController);  // Editar nombre/email superadmin
superadminRouter.delete("/superadmin/:id",    deleteSuperadminController); // Eliminar superadmin (excepto owner)
