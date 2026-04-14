import { Request, Response } from "express";
import { deleteLeaveRequestService } from "../../../../services/user/requests/delete-leave-request-service.js";
import {
    BodyResponse,
    ResponseError,
} from "../../../../types/express/response-type.js";
import { DeleteLeaveRequestResponse } from "../../../../types/dto/user/requests/delete-leave-request-response.js";

/**
 * Controller para cancelar una solicitud del usuario autenticado.
 *
 * Qué hace:
 * 1. Lee el id de la solicitud desde req.params.
 * 2. Comprueba que ese id sea válido.
 * 3. Saca el id del usuario autenticado desde el JWT.
 * 4. Llama al service para aplicar la lógica de negocio.
 * 5. Devuelve la respuesta de éxito.
 */
export async function deleteLeaveRequestController(
    req: Request<{ id: string }>,
    res: Response<BodyResponse<DeleteLeaveRequestResponse>>,
) {
    // Convertimos el id recibido por URL a número.
    const leaveRequestId = Number(req.params.id);

    // Validamos que sea un entero positivo.
    if (!Number.isInteger(leaveRequestId) || leaveRequestId <= 0) {
        throw new ResponseError(
            "ID inválido.",
            400,
            "BAD_REQUEST",
        );
    }

    // Sacamos el id del usuario autenticado desde el JWT.
    const userId = req.jwtClaims!.id;

    // Llamamos al service, que se encarga de toda la lógica de negocio.
    const data = await deleteLeaveRequestService(
        leaveRequestId,
        userId,
    );

    // Devolvemos la respuesta de éxito.
    res.status(200).json({ data });
}