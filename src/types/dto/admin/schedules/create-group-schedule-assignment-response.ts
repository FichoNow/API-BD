/**
 * Respuesta devuelta al asignar una plantilla de horario a un grupo.
 */
export interface CreateGroupScheduleAssignmentResponse {
  id: number;
  group_id: number;
  template_id: number;
  start_date: string;
  end_date: string | null;
}