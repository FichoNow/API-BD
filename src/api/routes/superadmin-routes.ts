import { Router } from "express";
import { patchCompanyController } from "../controllers/superadmin/patch-company-controller.js";

export const superadminRouter = Router();

superadminRouter.patch("/company", patchCompanyController); // Editar empresa propia
