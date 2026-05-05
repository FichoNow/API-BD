import { RowDataPacket } from "mysql2";
import { AsignacionUsuarioData } from "../../models/horarios/asignacion-usuario.js";

/** Representa una fila de la tabla `asignaciones_usuario` tal como la devuelve la base de datos. */
export interface AsignacionUsuarioRow extends RowDataPacket, AsignacionUsuarioData {}

/**
 * Fila de asignación de usuario enriquecida con datos del usuario y de la plantilla.
 *
 * La devuelven las queries que hacen JOIN con `users` y `plantillas_horario`,
 * usadas para listar asignaciones en el panel admin.
 */
export interface AsignacionUsuarioWithInfoRow extends RowDataPacket, AsignacionUsuarioData {
  user_name: string;
  user_email: string;
  template_name: string;
}

/**
 * Dayos necesarios para crear una asignación de horario a usuario.
 *
 * No incluye id, created_at ni updated_at porque los genera la base de datos.
 */
export type CreateAsignacionUsuarioRow = Pick<AsignacionUsuarioData,
"user_id" | "template_id" | "start_date" | "end_date">;
