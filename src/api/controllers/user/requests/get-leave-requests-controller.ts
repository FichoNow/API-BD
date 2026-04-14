import { Request, Response } from "express";
import { getLeaveRequestsService } from "../../../../services/user/requests/get-leave-requests-service.js";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { GetLeaveRequestsResponse } from "../../../../types/dto/user/requests/get-leave-requests-response.js";

/**
 * Controller para obtener todas las solicitudes
 * del usuario autenticado.
 *
 * Qué hace:
 * 1. Obtiene el id del usuario desde el JWT.
 * 2. Llama al service para recuperar sus solicitudes.
 * 3. Devuelve la lista en la respuesta.
 */
export async function getLeaveRequestsController(
    req: Request,
    res: Response<BodyResponse<GetLeaveRequestsResponse>>,
) {
    // Sacamos el id del usuario autenticado desde el JWT.
    const userId = req.jwtClaims!.id;

    // Pedimos al service el listado de solicitudes de ese usuario.
    const data = await getLeaveRequestsService(userId);

    // Devolvemos la respuesta.
    res.status(200).json({ data });
}