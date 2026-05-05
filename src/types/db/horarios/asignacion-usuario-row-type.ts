import { RowDataPacket } from "mysql2";
import { AsignacionUsuarioData } from "../../models/horarios/asignacion-usuario.js";

/** Representa una fila de la tabla `asignaciones_usuario` tal como la devuelve la base de datos. */
export interface AsignacionUsuarioRow extends RowDataPacket, AsignacionUsuarioData {}

/**
 * Dayos necesarios para crear una asignación de horario a usuario.
 * 
 * No incluye id, created_at ni updated_at porque los genera la base de datos.
 */
export type CreateAsignacionUsuarioRow = Pick<AsignacionUsuarioData,
"user_id" | "template_id" | "start_date" | "end_date">;