import { RowDataPacket } from "mysql2/promise";
import {
  LeaveRequestType,
  LeaveRequestStatus,
} from "../../models/requests/leave-request.js";

/**
 * Representa una fila del listado de solicitudes visto desde el panel admin.
 *
 * No es una fila directa de leave_requests, sino el resultado de una consulta
 * con JOIN para incluir también datos del empleado, tipo y estado.
 */
export interface AdminLeaveRequestListRow extends RowDataPacket {
  id: number;
  user_id: number;
  employee_name: string;
  employee_email: string;
  department_id: number;
  type: LeaveRequestType;
  start_date: Date;
  end_date: Date;
  start_time: string | null;
  end_time: string | null;
  status: LeaveRequestStatus;
  comment: string | null;
  reviewed_by: number | null;
  reviewed_at: Date | null;
  review_comment: string | null;
  created_at: Date;
}