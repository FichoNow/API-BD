import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { createPlantillaHorario } from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import { createDiaPlantilla } from "../../../database/repositories/horarios/dia-plantilla-repository.js";
import { CreateScheduleBody } from "../../../types/dto/admin/schedules/create-schedule-body.js";
import { CreateScheduleResponse } from "../../../types/dto/admin/schedules/create-schedule-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Crea una plantilla de horario completa con sus días.
 *
 * Reglas:
 * - El departamento debe existir.
 * - El departamento debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede crear horarios en su propio departamento.
 * - Los días laborables deben tener horario válido.
 * - Se calculan automáticamente los minutos semanales.
 */
export async function createScheduleService(
  body: CreateScheduleBody,
  claims: JwtClaims,
): Promise<CreateScheduleResponse> {
  const department = await findDepartmentById(body.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Departamento no encontrado",
      404,
      "DEPARTMENT_NOT_FOUND",
    );
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== body.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const weeklyMinutes = calculateWeeklyMinutes(body.days);

  const templateId = await createPlantillaHorario({
    department_id: body.department_id,
    name: body.name.trim(),
    description: body.description?.trim() || null,
    weekly_minutes: weeklyMinutes,
    is_active: body.is_active,
  });

  const sortedDays = [...body.days].sort((a, b) => a.weekday - b.weekday);

  for (const day of sortedDays) {
    await createDiaPlantilla({
      template_id: templateId,
      weekday: day.weekday,
      is_working_day: day.is_working_day,
      start_time: day.start_time,
      end_time: day.end_time,
      break_minutes: day.break_minutes,
    });
  }

  return {
    id: templateId,
    department_id: body.department_id,
    name: body.name.trim(),
    description: body.description?.trim() || null,
    weekly_minutes: weeklyMinutes,
    is_active: body.is_active,
  };
}

/**
 * Calcula los minutos semanales de una plantilla.
 *
 * Ejemplo:
 * 09:00 - 18:00 con 60 min descanso = 480 minutos.
 */
function calculateWeeklyMinutes(days: CreateScheduleBody["days"]): number {
  let total = 0;

  for (const day of days) {
    if (!day.is_working_day) continue;

    if (!day.start_time || !day.end_time) {
      throw new ResponseError(
        "Los días laborables deben tener hora de inicio y fin",
        400,
        "BAD_REQUEST",
      );
    }

    const start = timeToMinutes(day.start_time);
    const end = timeToMinutes(day.end_time);

    if (end <= start) {
      throw new ResponseError(
        "La hora de fin debe ser posterior a la hora de inicio",
        400,
        "BAD_REQUEST",
      );
    }

    const workedMinutes = end - start - day.break_minutes;

    if (workedMinutes <= 0) {
      throw new ResponseError(
        "El descanso no puede ser igual o superior a la duración del turno",
        400,
        "BAD_REQUEST",
      );
    }

    total += workedMinutes;
  }

  return total;
}

/**
 * Convierte "HH:mm:ss" a minutos totales.
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}