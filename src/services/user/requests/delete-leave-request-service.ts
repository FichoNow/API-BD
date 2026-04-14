import {
    findLeaveRequestById,
    updateLeaveRequestStatusById,
} from "../../../database/repositories/requests/leave-request-repository.js";
import { findLeaveRequestStatusByCode } from "../../../database/repositories/requests/leave-request-catalog-repository.js";
import { DeleteLeaveRequestResponse } from "../../../types/dto/user/requests/delete-leave-request-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Lógica de negocio para cancelar una solicitud del usuario.
 *
 * Reglas:
 * 1. La solicitud debe existir.
 * 2. La solicitud debe pertenecer al usuario autenticado.
 * 3. Solo se puede cancelar si está en estado PENDING.
 * 4. La cancelación se hace cambiando el estado a CANCELLED.
 */
export async function deleteLeaveRequestService(
    leaveRequestId: number,
    userId: number,
): Promise<DeleteLeaveRequestResponse> {
    // Buscamos la solicitud por su id.
    const leaveRequest = await findLeaveRequestById(leaveRequestId);

    // Si no existe, devolvemos error 404.
    if (!leaveRequest) {
        throw new ResponseError(
            "Solicitud no encontrada.",
            404,
            "LEAVE_REQUEST_NOT_FOUND",
        );
    }

    // Comprobamos que la solicitud pertenece al usuario autenticado.
    if (leaveRequest.user_id !== userId) {
        throw new ResponseError(
            "No tienes permiso para cancelar esta solicitud.",
            403,
            "FORBIDDEN_LEAVE_REQUEST",
        );
    }

    // Buscamos el estado CANCELLED en catálogo.
    const cancelledStatus = await findLeaveRequestStatusByCode("CANCELLED");

    // Si no existe en BD, hay un problema de configuración.
    if (!cancelledStatus) {
        throw new ResponseError(
            "Estado CANCELLED no encontrado.",
            500,
            "LEAVE_REQUEST_STATUS_NOT_FOUND",
        );
    }

    // Solo permitimos cancelar solicitudes que estén en PENDING.
    // Según tus inserts, PENDING es id 1, pero no queremos fiarnos
    // de un número mágico. Por eso comprobamos por id contra el catálogo
    // buscando también el estado PENDING.
    const pendingStatus = await findLeaveRequestStatusByCode("PENDING");

    if (!pendingStatus) {
        throw new ResponseError(
            "Estado PENDING no encontrado.",
            500,
            "LEAVE_REQUEST_STATUS_NOT_FOUND",
        );
    }

    if (leaveRequest.status_id !== pendingStatus.id) {
        throw new ResponseError(
            "Solo se puede cancelar una solicitud pendiente.",
            400,
            "LEAVE_REQUEST_NOT_PENDING",
        );
    }

    // Actualizamos el estado de la solicitud a CANCELLED.
    const updated = await updateLeaveRequestStatusById(
        leaveRequestId,
        cancelledStatus.id,
    );

    // Si por alguna razón no se actualizó ninguna fila, devolvemos error.
    if (!updated) {
        throw new ResponseError(
            "No se pudo cancelar la solicitud.",
            500,
            "LEAVE_REQUEST_NOT_UPDATED",
        );
    }

    // Devolvemos un mensaje simple de éxito.
    return {
        message: "Request cancelled successfully",
    };
}