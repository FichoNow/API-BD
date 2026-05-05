/**
 * Día concreto dentro de una plantilla de horario.
 *
 * weekday:
 * 1 = Lunes
 * 2 = Martes
 * ...
 * 7 = Domingo
 */
export interface ScheduleDayResponse {
  id: number;
  weekday: number;
  is_working_day: boolean;
  start_time: string | null;
  end_time: string | null;
  break_minutes: number;
}

/**
 * Plantilla de horario completa con sus días.
 */
export interface ScheduleTemplateResponse {
  id: number;
  department_id: number;
  name: string;
  description: string | null;
  weekly_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  days: ScheduleDayResponse[];
}

/**
 * Respuesta del endpoint GET /admin/schedules.
 */
export type GetSchedulesResponse = ScheduleTemplateResponse[];