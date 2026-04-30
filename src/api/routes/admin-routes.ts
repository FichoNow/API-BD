import { Router } from "express";
import { overviewRouter }  from "./admin/overview-routes.js";
import { usersRouter }     from "./admin/users-routes.js";
import { projectsRouter }  from "./admin/projects-routes.js";
import { requestsRouter }  from "./admin/requests-routes.js";
import { statsRouter }     from "./admin/stats-routes.js";
import { groupsRouter }    from "./admin/groups-routes.js";

export const adminRouter = Router();

adminRouter.use(overviewRouter);
adminRouter.use(usersRouter);
adminRouter.use(projectsRouter);
adminRouter.use(requestsRouter);
adminRouter.use(statsRouter);
adminRouter.use(groupsRouter);
