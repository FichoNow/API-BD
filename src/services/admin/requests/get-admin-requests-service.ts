import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findLeaveRequestsByDepartmentId } from "../../../database/repositories/requests/leave-request-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetAdminRequestsResponse } from "../../../types/dto/admin/requests/get-admin-requests-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Devuelve las solicitudes de ausencia de un departamento.
 *
 * - ADMINISTRATOR: solo puede consultar su propio departamento.
 * - SUPERADMIN: puede consultar cualquier departamento de su empresa.
 *
 * @param departmentId ID del departamento a consultar.
 * @param claims Claims del token del administrador autenticado.
 * @returns Lista de solicitudes del departamento.
 */
export async function getAdminRequestsService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetAdminRequestsResponse> {
  const department = await findDepartmentById(departmentId);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Departamento no encontrado",
      404,
      "DEPARTMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const requests = await findLeaveRequestsByDepartmentId(departmentId);

  return requests.map((request) => ({
    id: request.id,
    user_id: request.user_id,
    employee_name: request.employee_name,
    employee_email: request.employee_email,
    department_id: request.department_id,
    type: request.type,
    start_date: request.start_date.toISOString().slice(0, 10),
    end_date: request.end_date.toISOString().slice(0, 10),
    start_time: request.start_time,
    end_time: request.end_time,
    status: request.status,
    comment: request.comment,
    reviewed_by: request.reviewed_by,
    reviewed_at: request.reviewed_at,
    review_comment: request.review_comment,
    created_at: request.created_at,
  }));
}