import { getDaysInMonth, getDay, format, isBefore } from "date-fns";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { findAsignacionActivaByUserId } from "../../../database/repositories/horarios/asignacion-usuario-repository.js";
import { findAsignacionActivaByGrupoId } from "../../../database/repositories/horarios/asignacion-grupo-repository.js";
import { findPlantillaHorarioById } from "../../../database/repositories/horarios/plantilla-horario-repository.js";
import { findDiasPlantillaByPlantillaId } from "../../../database/repositories/horarios/dia-plantilla-repository.js";
import { findFichajesByUserIdAndMonth } from "../../../database/repositories/fichajes/fichaje-repository.js";
import { findExcepcionesCalendarioByMonth } from "../../../database/repositories/horarios/excepcion-calendario-repository.js";
import { findAllTiposExcepcion } from "../../../database/repositories/horarios/tipo-excepcion-repository.js";
import { AsignacionUsuarioRow } from "../../../types/db/horarios/asignacion-usuario-row-type.js";
import { AsignacionGrupoRow } from "../../../types/db/horarios/asignacion-grupo-row-type.js";
import {
  CalendarDay,
  GetCalendarMonthResponse,
} from "../../../types/dto/user/calendar/get-calendar-month-response.js";

/**
 * Lógica de negocio para construir el calendario mensual de un usuario.
 * Combina la plantilla de horario asignada, los fichajes del mes y las
 * excepciones de calendario (festivos, vacaciones, bajas...) para
 * calcular el estado de cada día del mes.
 *
 * @param userClaims Claims del JWT del usuario (id, company_id, group_id).
 * @param year Año del mes a consultar.
 * @param month Mes a consultar (1-12).
 * @returns Objeto con el estado de cada día del mes.
 */
export async function buildCalendarMonthService(
  userClaims: JwtClaims,
  year: number,
  month: number,
): Promise<GetCalendarMonthResponse> {
  const firstDay = format(new Date(year, month - 1, 1), "yyyy-MM-dd");

  // Buscamos asignación individual primero, si no tiene, la del grupo
  let asignacion: AsignacionUsuarioRow | AsignacionGrupoRow | null =
    await findAsignacionActivaByUserId(userClaims.id, firstDay);

  if (!asignacion && userClaims.group_id) {
    asignacion = await findAsignacionActivaByGrupoId(userClaims.group_id, firstDay);
  }

  if (!asignacion) {
    throw new ResponseError("Horario no asignado.", 404, "SCHEDULE_NOT_FOUND");
  }

  const plantilla = await findPlantillaHorarioById(asignacion.template_id);

  if (!plantilla) {
    throw new ResponseError("Plantilla de horario no encontrada.", 404, "SCHEDULE_NOT_FOUND");
  }

  // Cargamos todos los datos que necesitamos para construir el calendario
  const diasPlantilla = await findDiasPlantillaByPlantillaId(asignacion.template_id);
  const fichajes = await findFichajesByUserIdAndMonth(userClaims.id, year, month);
  const excepciones = await findExcepcionesCalendarioByMonth(userClaims.company_id, userClaims.id, userClaims.group_id, year, month);
  const tiposExcepcion = await findAllTiposExcepcion();

  const today = new Date();
  const totalDays = getDaysInMonth(new Date(year, month - 1));
  const days: CalendarDay[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month - 1, d);
    const dateStr = format(date, "yyyy-MM-dd"); // "2026-04-01"

    // getDay() devuelve 0=Dom...6=Sab, lo convertimos a 1=Lun...7=Dom
    const weekday = getDay(date) === 0 ? 7 : getDay(date);

    // Buscamos el horario de este día de la semana en la plantilla
    const diaPlantilla = diasPlantilla.find((d) => d.weekday === weekday) ?? null;

    // Buscamos si el usuario fichó este día
    const fichaje = fichajes.find((f) => format(f.clock_in, "yyyy-MM-dd") === dateStr) ?? null;

    // Buscamos si hay alguna excepción (festivo, vacación...) que cubra este día
    const excepcion = excepciones.find(
      (e) => e.start_date <= dateStr && e.end_date >= dateStr,
    ) ?? null;

    const isWorkingDay = diaPlantilla?.is_working_day ?? false;

    // Calculamos el horario planificado si es día laboral
    let planned: CalendarDay["planned"] = null;
    if (isWorkingDay && diaPlantilla?.start_time && diaPlantilla?.end_time) {
      const plannedMinutes =
        timeToMinutes(diaPlantilla.end_time) -
        timeToMinutes(diaPlantilla.start_time) -
        diaPlantilla.break_minutes;

      planned = {
        startTime: diaPlantilla.start_time,
        endTime: diaPlantilla.end_time,
        breakMinutes: diaPlantilla.break_minutes,
        plannedMinutes,
      };
    }

    // Determinamos el estado del día
    let statusType: string;

    if (excepcion) {
      // Hay una excepción → buscamos su código ("HOLIDAY", "VACATION"...)
      statusType = tiposExcepcion.find((t) => t.id === excepcion.tipo_id)?.code ?? "UNKNOWN";
    } else if (!isWorkingDay) {
      statusType = "DAY_OFF";
    } else if (fichaje) {
      statusType = "WORKED";
    } else if (isBefore(date, today)) {
      statusType = "ABSENT";
    } else {
      statusType = "PLANNED";
    }

    days.push({ date: dateStr, isWorkingDay, planned, statusType });
  }

  return { userId: userClaims.id, year, month, days };
}

/**
 * Convierte una cadena de tiempo "HH:mm:ss" a minutos totales.
 * Por ejemplo: "09:00:00" → 540.
 * Se usa para calcular la duración planificada del día.
 *
 * @param time Cadena en formato "HH:mm:ss".
 * @returns Minutos totales.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
