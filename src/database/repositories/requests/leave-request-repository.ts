import { ResultSetHeader } from "mysql2/promise";
import {
    LeaveRequestRow,
    CreateLeaveRequestRow,
} from "../../../types/db/requests/leave-request-row-type.js";
import { LeaveRequestListRow } from "../../../types/db/requests/leave-request-list-row-type.js";
import { pool } from "../../pool.js";
import { AdminLeaveRequestListRow } from "../../../types/db/requests/admin-leave-request-list-row-type.js";

export async function findLeaveRequestById(
    leaveRequestId: number,
): Promise<LeaveRequestRow | null> {
    const [rows] = await pool.query<LeaveRequestRow[]>(
        "SELECT * FROM leave_requests WHERE id = ? LIMIT 1",
        [leaveRequestId],
    );

    return rows.length ? rows[0] : null;
}

export async function createLeaveRequest(
    data: CreateLeaveRequestRow,
): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO leave_requests (
            user_id,
            type_id,
            start_date,
            end_date,
            start_time,
            end_time,
            comment,
            status_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.user_id,
            data.type_id,
            data.start_date,
            data.end_date,
            data.start_time,
            data.end_time,
            data.comment,
            data.status_id,
        ],
    );

    return result.insertId;
}

/**
 * Busca todas las solicitudes de un usuario.
 *
 * Hacemos JOIN con:
 * - leave_request_types -> para obtener el código del tipo (VACATION, PERMISSION, etc.)
 * - leave_request_statuses -> para obtener el código del estado (PENDING, APPROVED, etc.)
 *
 * Devolvemos las solicitudes ordenadas de la más nueva a la más antigua.
 */
export async function findLeaveRequestsByUserId(
    userId: number,
): Promise<LeaveRequestListRow[]> {
    const [rows] = await pool.query<LeaveRequestListRow[]>(
        `SELECT
            lr.id,
            lrt.code AS type,
            lr.start_date,
            lr.end_date,
            lr.start_time,
            lr.end_time,
            lrs.code AS status,
            lr.comment
        FROM leave_requests lr
        INNER JOIN leave_request_types lrt
            ON lrt.id = lr.type_id
        INNER JOIN leave_request_statuses lrs
            ON lrs.id = lr.status_id
        WHERE lr.user_id = ?
        ORDER BY lr.created_at DESC`,
        [userId],
    );

    return rows;
}

/**
 * Actualiza el estado de una solicitud concreta.
 *
 * Recibe:
 * - el id de la solicitud que queremos modificar
 * - el nuevo status_id que queremos guardar
 *
 * Devuelve:
 * - true si se actualizó alguna fila
 * - false si no se actualizó ninguna
 */
export async function updateLeaveRequestStatusById(
    leaveRequestId: number,
    statusId: number,
): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE leave_requests SET status_id = ? WHERE id = ? LIMIT 1",
        [statusId, leaveRequestId],
    );

    return result.affectedRows > 0;
}

/**
 * Busca todas las solicitudes de ausencia de los usuarios de un departamento.
 *
 * Se usa desde el panel admin para que un administrador pueda revisar
 * vacaciones, permisos, bajas y citas médicas de su departamento.
 *
 * Hacemos JOIN con:
 * - users -> para obtener nombre/email del empleado
 * - leave_request_types -> para obtener el código del tipo
 * - leave_request_statuses -> para obtener el código del estado
 */
export async function findLeaveRequestsByDepartmentId(
  departmentId: number,
): Promise<AdminLeaveRequestListRow[]> {
  const [rows] = await pool.query<AdminLeaveRequestListRow[]>(
    `SELECT
        lr.id,
        lr.user_id,
        u.name AS employee_name,
        u.email AS employee_email,
        u.department_id,
        lrt.code AS type,
        lr.start_date,
        lr.end_date,
        lr.start_time,
        lr.end_time,
        lrs.code AS status,
        lr.comment,
        lr.reviewed_by,
        lr.reviewed_at,
        lr.review_comment,
        lr.created_at
     FROM leave_requests lr
     INNER JOIN users u
        ON u.id = lr.user_id
     INNER JOIN leave_request_types lrt
        ON lrt.id = lr.type_id
     INNER JOIN leave_request_statuses lrs
        ON lrs.id = lr.status_id
     WHERE u.department_id = ?
     ORDER BY lr.created_at DESC`,
    [departmentId],
  );

  return rows;
}

/**
 * Actualiza una solicitud como revisada por un administrador.
 *
 * Guarda:
 * - nuevo estado
 * - usuario que revisa
 * - fecha/hora de revisión
 * - comentario de revisión
 *
 * Se usará tanto para aprobar como para rechazar solicitudes.
 */
export async function reviewLeaveRequestById(
  leaveRequestId: number,
  statusId: number,
  reviewedBy: number,
  reviewComment: string | null,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE leave_requests
     SET
        status_id = ?,
        reviewed_by = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        review_comment = ?
     WHERE id = ?
     LIMIT 1`,
    [statusId, reviewedBy, reviewComment, leaveRequestId],
  );

  return result.affectedRows > 0;
}