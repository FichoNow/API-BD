import {
  deleteAsignacionGrupoById,
  findAsignacionGrupoById,
} from "../../../database/repositories/horarios/asignacion-grupo-repository.js";
import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { DeleteScheduleAssignmentResponse } from "../../../types/dto/admin/schedules/delete-schedule-assignment-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Borra una asignación de horario de grupo.
 *
 * Reglas:
 * - La asignación debe existir.
 * - El departamento del grupo debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede borrar dentro de su propio departamento.
 */
export async function deleteGroupScheduleAssignmentService(
  assignmentId: number,
  claims: JwtClaims,
): Promise<DeleteScheduleAssignmentResponse> {
  const assignment = await findAsignacionGrupoById(assignmentId);

  if (!assignment) {
    throw new ResponseError(
      "Asignación no encontrada",
      404,
      "SCHEDULE_ASSIGNMENT_NOT_FOUND",
    );
  }

  const group = await findGroupById(assignment.group_id);

  if (!group) {
    throw new ResponseError(
      "Grupo no encontrado",
      404,
      "GROUP_NOT_FOUND",
    );
  }

  const department = await findDepartmentById(group.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Asignación no encontrada",
      404,
      "SCHEDULE_ASSIGNMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== group.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const deleted = await deleteAsignacionGrupoById(assignmentId);

  if (!deleted) {
    throw new ResponseError(
      "No se pudo borrar la asignación",
      500,
      "SCHEDULE_ASSIGNMENT_DELETE_FAILED",
    );
  }

  return { id: assignmentId };
}
