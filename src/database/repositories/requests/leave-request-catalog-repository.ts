import {
    LeaveRequestTypeRow,
    LeaveRequestStatusRow,
} from "../../../types/db/requests/leave-request-catalog-row-type.js";
import { pool } from "../../pool.js";

/**
 * Busca un tipo de solicitud por su código.
 * Ejemplos de code:
 * - VACATION
 * - PERMISSION
 * - MEDICAL_APPOINTMENT
 *
 * Devuelve la fila completa si existe, o null si no existe.
 */
export async function findLeaveRequestTypeByCode(
    code: string,
): Promise<LeaveRequestTypeRow | null> {
    const [rows] = await pool.query<LeaveRequestTypeRow[]>(
        "SELECT * FROM leave_request_types WHERE code = ? LIMIT 1",
        [code],
    );

    return rows.length ? rows[0] : null;
}

/**
 * Busca un estado de solicitud por su código.
 * Ejemplos de code:
 * - PENDING
 * - APPROVED
 * - REJECTED
 * - CANCELLED
 *
 * Devuelve la fila completa si existe, o null si no existe.
 */
export async function findLeaveRequestStatusByCode(
    code: string,
): Promise<LeaveRequestStatusRow | null> {
    const [rows] = await pool.query<LeaveRequestStatusRow[]>(
        "SELECT * FROM leave_request_statuses WHERE code = ? LIMIT 1",
        [code],
    );

    return rows.length ? rows[0] : null;
}