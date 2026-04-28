import { LeaveRequestStatus } from "../../models/requests/leave-request.js";

/**
 * Respuesta devuelta al aprobar o rechazar una solicitud desde el panel admin.
 */
export interface ReviewRequestResponse {
  id: number;
  status: LeaveRequestStatus;
  reviewed_by: number;
  reviewed_at: Date;
  review_comment: string | null;
}