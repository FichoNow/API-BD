/**
 * Respuesta devuelta al actualizar una plantilla de horario.
 */
export interface UpdateScheduleResponse {
  id: number;
  department_id: number;
  name: string;
  description: string | null;
  weekly_minutes: number;
  is_active: boolean;
}
