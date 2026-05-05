/**
 * Asignación de horario individual de un usuario.
 */
export interface UserScheduleAssignmentItem {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  template_id: number;
  template_name: string;
  start_date: string;
  end_date: string | null;
}

/**
 * Asignación de horario de un grupo.
 */
export interface GroupScheduleAssignmentItem {
  id: number;
  group_id: number;
  group_name: string;
  template_id: number;
  template_name: string;
  start_date: string;
  end_date: string | null;
}

/**
 * Respuesta del endpoint GET /admin/schedule/assignments.
 *
 * Contiene todas las asignaciones de horario (a usuario y a grupo) de un
 * departamento, para que el panel pueda mostrar quién tiene qué plantilla
 * y en qué rango.
 */
export interface GetScheduleAssignmentsResponse {
  user_assignments: UserScheduleAssignmentItem[];
  group_assignments: GroupScheduleAssignmentItem[];
}
