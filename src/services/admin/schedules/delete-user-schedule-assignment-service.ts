import {
  deleteAsignacionUsuarioById,
  findAsignacionUsuarioById,
} from "../../../database/repositories/horarios/asignacion-usuario-repository.js";
import { findUserById } from "../../../database/repositories/user-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { DeleteScheduleAssignmentResponse } from "../../../types/dto/admin/schedules/delete-schedule-assignment-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Borra una asignación de horario de usuario.
 *
 * Reglas:
 * - La asignación debe existir.
 * - El departamento del usuario debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede borrar dentro de su propio departamento.
 */
export async function deleteUserScheduleAssignmentService(
  assignmentId: number,
  claims: JwtClaims,
): Promise<DeleteScheduleAssignmentResponse> {
  const assignment = await findAsignacionUsuarioById(assignmentId);

  if (!assignment) {
    throw new ResponseError(
      "Asignación no encontrada",
      404,
      "SCHEDULE_ASSIGNMENT_NOT_FOUND",
    );
  }

  const user = await findUserById(assignment.user_id);

  if (!user) {
    throw new ResponseError(
      "Usuario no encontrado",
      404,
      "USER_NOT_FOUND",
    );
  }

  const department = await findDepartmentById(user.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Asignación no encontrada",
      404,
      "SCHEDULE_ASSIGNMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== user.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const deleted = await deleteAsignacionUsuarioById(assignmentId);

  if (!deleted) {
    throw new ResponseError(
      "No se pudo borrar la asignación",
      500,
      "SCHEDULE_ASSIGNMENT_DELETE_FAILED",
    );
  }

  return { id: assignmentId };
}
