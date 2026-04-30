import { Router } from "express";
import { getOverviewController }        from "../../controllers/admin/stats/get-overview-controller.js";
import { getRankingController }         from "../../controllers/admin/stats/get-ranking-controller.js";
import { getProjectsPeriodController }  from "../../controllers/admin/stats/get-projects-period-controller.js";
import { getActiveNowController }       from "../../controllers/admin/stats/get-active-now-controller.js";
import { getHourlyController }          from "../../controllers/admin/stats/get-hourly-controller.js";
import { getAbsencesController }        from "../../controllers/admin/stats/get-absences-controller.js";
import { getTopDaysController }         from "../../controllers/admin/stats/get-top-days-controller.js";
import { getBreaksController }          from "../../controllers/admin/stats/get-breaks-controller.js";
import { getOvertimeYearlyController }  from "../../controllers/admin/stats/get-overtime-yearly-controller.js";
import { getGroupsController }          from "../../controllers/admin/stats/get-groups-controller.js";
import { getUserProjectHoursController } from "../../controllers/admin/stats/get-user-project-hours-controller.js";
import { getUserStatsController }       from "../../controllers/admin/stats/get-user-stats-controller.js";
import { getProjectStatsController }    from "../../controllers/admin/stats/get-project-stats-controller.js";
import { getProjectsOverviewController } from "../../controllers/admin/stats/get-projects-overview-controller.js";

export const statsRouter = Router();

// Vista general — endpoints granulares
statsRouter.get("/stats/overview",         getOverviewController);
statsRouter.get("/stats/ranking",          getRankingController);
statsRouter.get("/stats/projects-period",  getProjectsPeriodController);
statsRouter.get("/stats/active-now",       getActiveNowController);
statsRouter.get("/stats/hourly",           getHourlyController);
statsRouter.get("/stats/absences",         getAbsencesController);
statsRouter.get("/stats/top-days",         getTopDaysController);
statsRouter.get("/stats/breaks",           getBreaksController);
statsRouter.get("/stats/overtime-yearly",  getOvertimeYearlyController);
statsRouter.get("/stats/groups",             getGroupsController);
statsRouter.get("/stats/user-project-hours", getUserProjectHoursController);

// Composite endpoints
statsRouter.get("/stats/user/:userId",     getUserStatsController);
statsRouter.get("/stats/projects",         getProjectsOverviewController);
statsRouter.get("/stats/project",          getProjectStatsController);
