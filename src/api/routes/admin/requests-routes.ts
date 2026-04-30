import { Router } from "express";
import { getAdminRequestsController } from "../../controllers/admin/requests/get-admin-requests-controller.js";
import { approveRequestController }   from "../../controllers/admin/requests/approve-request-controller.js";
import { rejectRequestController }    from "../../controllers/admin/requests/reject-request-controller.js";

export const requestsRouter = Router();

requestsRouter.get("/requests",              getAdminRequestsController);
requestsRouter.patch("/requests/:id/approve", approveRequestController);
requestsRouter.patch("/requests/:id/reject",  rejectRequestController);
