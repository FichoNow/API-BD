import { findDepartmentById } from "../../database/repositories/department-repository.js";
import { findUserById } from "../../database/repositories/user-repository.js";
import {
  findLeaveRequestById,
  reviewLeaveRequestById,
} from "../../database/repositories/requests/leave-request-repository.js";
import { findLeaveRequestStatusByCode } from "../../database/repositories/requests/leave-request-catalog-repository.js";
import { JwtClaims } from "../../types/dto/jwt/jwt-claims-dto.js";
import { ReviewRequestBody } from "../../types/dto/admin/review-request-body.js";
import { ReviewRequestResponse } from "../../types/dto/admin/review-request-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Rechaza una solicitud de ausencia desde el panel admin.
 *
 * Reglas:
 * - La solicitud debe existir.
 * - El usuario de la solicitud debe existir.
 * - La solicitud debe pertenecer a la misma empresa del admin.
 * - ADMINISTRATOR solo puede revisar solicitudes de su departamento.
 * - La solicitud debe estar en estado PENDING.
 * - Al rechazar, NO se crea excepción de calendario.
 */
export async function rejectRequestService(
  requestId: number,
  body: ReviewRequestBody,
  claims: JwtClaims,
): Promise<ReviewRequestResponse> {
  const leaveRequest = await findLeaveRequestById(requestId);

  if (!leaveRequest) {
    throw new ResponseError(
      "Solicitud no encontrada",
      404,
      "REQUEST_NOT_FOUND",
    );
  }

  const user = await findUserById(leaveRequest.user_id);

  if (!user) {
    throw new ResponseError(
      "Usuario de la solicitud no encontrado",
      404,
      "USER_NOT_FOUND",
    );
  }

  const department = await findDepartmentById(user.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Solicitud no encontrada",
      404,
      "REQUEST_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== user.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const [pendingStatus, rejectedStatus] = await Promise.all([
    findLeaveRequestStatusByCode("PENDING"),
    findLeaveRequestStatusByCode("REJECTED"),
  ]);

  if (!pendingStatus || !rejectedStatus) {
    throw new ResponseError(
      "Estados de solicitud no configurados",
      500,
      "REQUEST_STATUS_NOT_CONFIGURED",
    );
  }

  if (leaveRequest.status_id !== pendingStatus.id) {
    throw new ResponseError(
      "Solo se pueden rechazar solicitudes pendientes",
      409,
      "REQUEST_NOT_PENDING",
    );
  }

  const reviewComment = body.review_comment?.trim() || null;

  const updated = await reviewLeaveRequestById(
    requestId,
    rejectedStatus.id,
    claims.id,
    reviewComment,
  );

  if (!updated) {
    throw new ResponseError(
      "Error al rechazar la solicitud",
      500,
      "REQUEST_REJECT_FAILED",
    );
  }

  return {
    id: requestId,
    status: "REJECTED",
    reviewed_by: claims.id,
    reviewed_at: new Date(),
    review_comment: reviewComment,
  };
}