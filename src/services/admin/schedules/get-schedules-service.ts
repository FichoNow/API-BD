import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findAllPlantillasHorarioByDepartmentId } from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import { findDiasPlantillaByPlantillaId } from "../../../database/repositories/horarios/dia-plantilla-repository.js";
import { GetSchedulesResponse } from "../../../types/dto/admin/schedules/get-schedules-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Devuelve las plantillas de horario de un departamento con sus días.
 *
 * - ADMINISTRATOR: solo puede consultar su propio departamento.
 * - SUPERADMIN: puede consultar cualquier departamento de su empresa.
 */
export async function getSchedulesService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetSchedulesResponse> {
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

  const templates = await findAllPlantillasHorarioByDepartmentId(departmentId);

  const response: GetSchedulesResponse = [];

  for (const template of templates) {
    const days = await findDiasPlantillaByPlantillaId(template.id);

    response.push({
      id: template.id,
      department_id: template.department_id,
      name: template.name,
      description: template.description,
      weekly_minutes: template.weekly_minutes,
      is_active: template.is_active,
      created_at: template.created_at,
      updated_at: template.updated_at,
      days: days.map((day) => ({
        id: day.id,
        weekday: day.weekday,
        is_working_day: day.is_working_day,
        start_time: day.start_time,
        end_time: day.end_time,
        break_minutes: day.break_minutes,
      })),
    });
  }

  return response;
}