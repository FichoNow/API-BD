import { Router } from "express";
import { getDepartmentStatsController } from "../../controllers/admin/stats/get-department-stats-controller.js";
import { getUserStatsController }       from "../../controllers/admin/stats/get-user-stats-controller.js";

export const statsRouter = Router();

statsRouter.get("/stats/department",      getDepartmentStatsController);
statsRouter.get("/stats/user/:userId",    getUserStatsController);
