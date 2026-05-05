import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findPlantillaHorarioById } from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import { createAsignacionGrupo } from "../../../database/repositories/horarios/asignacion-grupo-repository.js";
import { CreateGroupScheduleAssignmentBody } from "../../../types/dto/admin/schedules/create-group-schedule-assignment-body.js";
import { CreateGroupScheduleAssignmentResponse } from "../../../types/dto/admin/schedules/create-group-schedule-assignment-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Asigna una plantilla de horario a un grupo.
 *
 * Reglas:
 * - El grupo debe existir.
 * - La plantilla debe existir.
 * - Grupo y plantilla deben pertenecer al mismo departamento.
 * - El departamento debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede asignar horarios dentro de su propio departamento.
 */
export async function createGroupScheduleAssignmentService(
  body: CreateGroupScheduleAssignmentBody,
  claims: JwtClaims,
): Promise<CreateGroupScheduleAssignmentResponse> {
  const group = await findGroupById(body.group_id);

  if (!group) {
    throw new ResponseError(
      "Grupo no encontrado",
      404,
      "GROUP_NOT_FOUND",
    );
  }

  const template = await findPlantillaHorarioById(body.template_id);

  if (!template) {
    throw new ResponseError(
      "Plantilla de horario no encontrada",
      404,
      "SCHEDULE_TEMPLATE_NOT_FOUND",
    );
  }

  if (template.department_id !== group.department_id) {
    throw new ResponseError(
      "La plantilla y el grupo no pertenecen al mismo departamento",
      400,
      "SCHEDULE_GROUP_DEPARTMENT_MISMATCH",
    );
  }

  const department = await findDepartmentById(group.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Departamento no encontrado",
      404,
      "DEPARTMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== group.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const assignmentId = await createAsignacionGrupo({
    group_id: body.group_id,
    template_id: body.template_id,
    start_date: body.start_date,
    end_date: body.end_date ?? null,
  });

  return {
    id: assignmentId,
    group_id: body.group_id,
    template_id: body.template_id,
    start_date: body.start_date,
    end_date: body.end_date ?? null,
  };
}