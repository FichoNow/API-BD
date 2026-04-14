import { RowDataPacket } from "mysql2/promise";

/**
 * Representa una fila del listado de solicitudes del usuario.
 *
 * Este tipo no es una fila "tal cual" de la tabla leave_requests,
 * sino el resultado de una consulta con JOIN para sacar también:
 * - el código del tipo de solicitud
 * - el código del estado
 */
export interface LeaveRequestListRow extends RowDataPacket {
    id: number;
    type: string;
    start_date: Date;
    end_date: Date;
    start_time: string | null;
    end_time: string | null;
    status: string;
    comment: string | null;
}