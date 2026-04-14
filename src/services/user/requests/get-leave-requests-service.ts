import { findLeaveRequestsByUserId } from "../../../database/repositories/requests/leave-request-repository.js";
import {
    GetLeaveRequestsResponse,
    GetLeaveRequestsResponseItem,
} from "../../../types/dto/user/requests/get-leave-requests-response.js";

/**
 * Lógica de negocio para obtener todas las solicitudes
 * del usuario autenticado.
 *
 * Qué hace este service:
 * 1. Pide al repository todas las solicitudes del usuario.
 * 2. Transforma el resultado de base de datos al formato
 *    de respuesta de la API.
 * 3. Devuelve la lista final.
 */
export async function getLeaveRequestsService(
    userId: number,
): Promise<GetLeaveRequestsResponse> {
    // Pedimos al repository las solicitudes del usuario.
    const leaveRequests = await findLeaveRequestsByUserId(userId);

    // Transformamos cada fila al formato que queremos devolver en la API.
    const response: GetLeaveRequestsResponseItem[] = leaveRequests.map((leaveRequest) => ({
        id: leaveRequest.id,
        type: leaveRequest.type,
        startDate: formatDateOnly(leaveRequest.start_date),
        endDate: formatDateOnly(leaveRequest.end_date),
        startTime: leaveRequest.start_time,
        endTime: leaveRequest.end_time,
        status: leaveRequest.status,
        comment: leaveRequest.comment,
    }));

    return response;
}

/**
 * Convierte una fecha a formato YYYY-MM-DD
 * usando la fecha local, no UTC.
 *
 * Así evitamos que toISOString() nos cambie el día
 * por culpa de la zona horaria.
 */
function formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}