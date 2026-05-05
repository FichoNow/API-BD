/**
 * Respuesta devuelta al crear una plantilla de horario.
 */
export interface CreateScheduleResponse {
  id: number;
  department_id: number;
  name: string;
  description: string | null;
  weekly_minutes: number;
  is_active: boolean;
}