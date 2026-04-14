import { Router } from "express";
import { postLeaveRequestController } from "../../controllers/user/requests/post-leave-request-controller.js";
import { getLeaveRequestsController } from "../../controllers/user/requests/get-leave-requests-controller.js";
import { deleteLeaveRequestController } from "../../controllers/user/requests/delete-leave-request-controller.js";

/**
 * Router para las solicitudes del usuario.
 *
 * De momento solo añadimos el endpoint de crear solicitud:
 * POST /user/requests
 */
export const requestsRouter = Router();

/**
 * Crear una nueva solicitud del usuario autenticado.
 */
requestsRouter.post("/", postLeaveRequestController);
/**
 * Obtener todas las solicitudes del usuario autenticado.
 */
requestsRouter.get("/", getLeaveRequestsController);
/**
 * Cancelar una solicitud concreta del usuario autenticado.
 */
requestsRouter.delete("/:id", deleteLeaveRequestController);