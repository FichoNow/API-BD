/**
 * Representa una solicitud individual dentro del listado
 * de solicitudes del usuario.
 */
export interface GetLeaveRequestsResponseItem {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
    status: string;
    comment: string | null;
}

/**
 * La respuesta del endpoint GET /user/requests
 * será una lista de solicitudes.
 */
export type GetLeaveRequestsResponse = GetLeaveRequestsResponseItem[];