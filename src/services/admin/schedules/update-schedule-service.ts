import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import {
  findPlantillaHorarioById,
  updatePlantillaHorario,
} from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import {
  createDiaPlantilla,
  deleteDiasPlantillaByPlantillaId,
} from "../../../database/repositories/horarios/dia-plantilla-repository.js";
import { pool } from "../../../database/pool.js";
import { UpdateScheduleBody } from "../../../types/dto/admin/schedules/update-schedule-body.js";
import { UpdateScheduleResponse } from "../../../types/dto/admin/schedules/update-schedule-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Actualiza una plantilla de horario completa con sus días.
 *
 * Reglas:
 * - La plantilla debe existir.
 * - El departamento de la plantilla debe pertenecer a la empresa del admin.
 * - ADMINISTRATOR solo puede editar horarios en su propio departamento.
 * - Los días laborables deben tener horario válido.
 * - Se recalculan automáticamente los minutos semanales.
 *
 * Estrategia: dentro de una transacción, se actualiza la cabecera de la
 * plantilla, se borran los 7 días previos y se vuelven a insertar.
 */
export async function updateScheduleService(
  templateId: number,
  body: UpdateScheduleBody,
  claims: JwtClaims,
): Promise<UpdateScheduleResponse> {
  const template = await findPlantillaHorarioById(templateId);

  if (!template) {
    throw new ResponseError(
      "Plantilla de horario no encontrada",
      404,
      "SCHEDULE_TEMPLATE_NOT_FOUND",
    );
  }

  const department = await findDepartmentById(template.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError(
      "Plantilla de horario no encontrada",
      404,
      "SCHEDULE_TEMPLATE_NOT_FOUND",
    );
  }

  if (
    claims.role === "ADMINISTRATOR" &&
    claims.department_id !== template.department_id
  ) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const weeklyMinutes = calculateWeeklyMinutes(body.days);
  const sortedDays = [...body.days].sort((a, b) => a.weekday - b.weekday);
  const description = body.description?.trim() || null;
  const name = body.name.trim();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await updatePlantillaHorario(
      templateId,
      {
        department_id: template.department_id,
        name,
        description,
        weekly_minutes: weeklyMinutes,
        is_active: body.is_active,
      },
      connection,
    );

    await deleteDiasPlantillaByPlantillaId(templateId, connection);

    for (const day of sortedDays) {
      await createDiaPlantilla(
        {
          template_id: templateId,
          weekday: day.weekday,
          is_working_day: day.is_working_day,
          start_time: day.start_time,
          end_time: day.end_time,
          break_minutes: day.break_minutes,
        },
        connection,
      );
    }

    await connection.commit();

    return {
      id: templateId,
      department_id: template.department_id,
      name,
      description,
      weekly_minutes: weeklyMinutes,
      is_active: body.is_active,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Calcula los minutos semanales de una plantilla.
 *
 * Ejemplo:
 * 09:00 - 18:00 con 60 min descanso = 480 minutos.
 */
function calculateWeeklyMinutes(days: UpdateScheduleBody["days"]): number {
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
