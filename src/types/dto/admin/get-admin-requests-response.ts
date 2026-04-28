import {
  LeaveRequestType,
  LeaveRequestStatus,
} from "../../models/requests/leave-request.js";

/**
 * Elemento que devuelve el panel admin al listar solicitudes de ausencia
 * de un departamento.
 */
export interface GetAdminRequestsResponseItem {
  id: number;
  user_id: number;
  employee_name: string;
  employee_email: string;
  department_id: number;
  type: LeaveRequestType;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  status: LeaveRequestStatus;
  comment: string | null;
  reviewed_by: number | null;
  reviewed_at: Date | null;
  review_comment: string | null;
  created_at: Date;
}

export type GetAdminRequestsResponse = GetAdminRequestsResponseItem[];