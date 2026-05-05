import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findUserById } from "../../../database/repositories/user-repository.js";
import { findPlantillaHorarioById } from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import {
  createAsignacionUsuario,
  findOpenAsignacionUsuarioBefore,
  updateAsignacionUsuarioEndDate,
} from "../../../database/repositories/horarios/asignacion-usuario-repository.js";
import { previousDay } from "../../../helpers/date.js";
import { CreateUserScheduleAssignmentBody } from "../../../types/dto/admin/schedules/create-user-schedule-assignment-body.js";
import { CreateUserScheduleAssignmentResponse } from "../../../types/dto/admin/schedules/create-user-schedule-assignment-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Asigna una plantilla de horario a un usuario individual.
 *
 * Reglas:
 * - El usuario debe existir.
 * - La plantilla debe existir.
 * - Usuario y plantilla deben pertenecer al mismo departamento.
 * - El departamento debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede asignar horarios dentro de su propio departamento.
 *
 * Si el usuario tiene una asignación abierta (sin end_date) anterior al
 * start_date de la nueva, se cierra automáticamente poniendo end_date al día
 * anterior. Esto evita solapamientos infinitos cuando se cambia de plantilla.
 *
 * Importante:
 * La asignación individual tiene prioridad sobre la asignación de grupo
 * cuando se construye el calendario mensual del usuario.
 */
export async function createUserScheduleAssignmentService(
  body: CreateUserScheduleAssignmentBody,
  claims: JwtClaims,
): Promise<CreateUserScheduleAssignmentResponse> {
  const user = await findUserById(body.user_id);

  if (!user) {
    throw new ResponseError(
      "Usuario no encontrado",
      404,
      "USER_NOT_FOUND",
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

  if (template.department_id !== user.department_id) {
    throw new ResponseError(
      "La plantilla y el usuario no pertenecen al mismo departamento",
      400,
      "SCHEDULE_USER_DEPARTMENT_MISMATCH",
    );
  }

  const department = await findDepartmentById(user.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Departamento no encontrado",
      404,
      "DEPARTMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== user.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const previousOpen = await findOpenAsignacionUsuarioBefore(
    body.user_id,
    body.start_date,
  );

  if (previousOpen) {
    await updateAsignacionUsuarioEndDate(
      previousOpen.id,
      previousDay(body.start_date),
    );
  }

  const assignmentId = await createAsignacionUsuario({
    user_id: body.user_id,
    template_id: body.template_id,
    start_date: body.start_date,
    end_date: body.end_date ?? null,
  });

  return {
    id: assignmentId,
    user_id: body.user_id,
    template_id: body.template_id,
    start_date: body.start_date,
    end_date: body.end_date ?? null,
  };
}
