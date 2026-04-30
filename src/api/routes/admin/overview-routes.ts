import { Router } from "express";
import { getCompanyInfoController } from "../../controllers/admin/overview/get-overview-controller.js";

export const overviewRouter = Router();

overviewRouter.get("/company-info", getCompanyInfoController);
