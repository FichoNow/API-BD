import { RowDataPacket } from "mysql2";
import { AsignacionGrupoData } from "../../models/horarios/asignacion-grupo.js";

/** Representa una fila de la tabla `asignaciones_grupo` tal como la devuelve la base de datos. */
export interface AsignacionGrupoRow extends RowDataPacket, AsignacionGrupoData {}

/**
 * Datos necesarios para crear una asignación de horario a grupo.
 *
 * No incluye id, created_at ni updated_at porque los genera la base de datos.
 */
export type CreateAsignacionGrupoRow = Pick<
  AsignacionGrupoData,
  "group_id" | "template_id" | "start_date" | "end_date"
>;