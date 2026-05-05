import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findAsignacionesUsuarioByDepartmentId } from "../../../database/repositories/horarios/asignacion-usuario-repository.js";
import { findAsignacionesGrupoByDepartmentId } from "../../../database/repositories/horarios/asignacion-grupo-repository.js";
import { toDateString } from "../../../helpers/date.js";
import { GetScheduleAssignmentsResponse } from "../../../types/dto/admin/schedules/get-schedule-assignments-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Devuelve las asignaciones de horario (usuario y grupo) de un departamento,
 * con el nombre de cada usuario/grupo y la plantilla correspondiente.
 *
 * - ADMINISTRATOR: solo puede consultar su propio departamento.
 * - SUPERADMIN: puede consultar cualquier departamento de su empresa.
 */
export async function getScheduleAssignmentsService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetScheduleAssignmentsResponse> {
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

  const [userRows, groupRows] = await Promise.all([
    findAsignacionesUsuarioByDepartmentId(departmentId),
    findAsignacionesGrupoByDepartmentId(departmentId),
  ]);

  return {
    user_assignments: userRows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      user_name: row.user_name,
      user_email: row.user_email,
      template_id: row.template_id,
      template_name: row.template_name,
      start_date: toDateString(row.start_date) ?? "",
      end_date: toDateString(row.end_date),
    })),
    group_assignments: groupRows.map((row) => ({
      id: row.id,
      group_id: row.group_id,
      group_name: row.group_name,
      template_id: row.template_id,
      template_name: row.template_name,
      start_date: toDateString(row.start_date) ?? "",
      end_date: toDateString(row.end_date),
    })),
  };
}
