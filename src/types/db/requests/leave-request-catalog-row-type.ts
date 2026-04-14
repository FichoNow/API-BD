import { RowDataPacket } from "mysql2/promise";

/**
 * Representa una fila real que viene de la tabla leave_request_types.
 * Extendemos de RowDataPacket para que mysql2 no se queje
 * cuando usemos pool.query<T[]>().
 */
export interface LeaveRequestTypeRow extends RowDataPacket {
    id: number;
    code: string;
    name: string;
    is_active: number | boolean;
}

/**
 * Representa una fila real que viene de la tabla leave_request_statuses.
 * También extiende de RowDataPacket por el mismo motivo.
 */
export interface LeaveRequestStatusRow extends RowDataPacket {
    id: number;
    code: string;
    name: string;
}