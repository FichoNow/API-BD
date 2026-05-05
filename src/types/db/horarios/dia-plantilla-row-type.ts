import { RowDataPacket } from "mysql2";
import { DiaPlantillaData } from "../../models/horarios/dia-plantilla.js";

/** Representa una fila de la tabla `dias_plantilla` tal como la devuelve la base de datos. */
export interface DiaPlantillaRow extends RowDataPacket, DiaPlantillaData {}

/**
 * Datos necesarios para crear un día dentro de una plantilla de horario.
 *
 * No incluye id, created_at ni updated_at porque los genera la base de datos.
 */
export type CreateDiaPlantillaRow = Pick<
  DiaPlantillaData,
  "template_id" | "weekday" | "is_working_day" | "start_time" | "end_time" | "break_minutes"
>;
