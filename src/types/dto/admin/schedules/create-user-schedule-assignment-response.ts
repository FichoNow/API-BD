/**
 * Respuesta devuelta al asignar una plantilla de horario a un usuario.
 */
export interface CreateUserScheduleAssignmentResponse {
    id: number;
    user_id: number;
    template_id: number;
    start_date: string;
    end_date: string | null;
}