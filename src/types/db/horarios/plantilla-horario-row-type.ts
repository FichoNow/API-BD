import { RowDataPacket } from "mysql2";
import { PlantillaHorarioData } from "../../models/horarios/plantilla-horario.js";

/** Representa una fila de la tabla `plantillas_horario` tal como la devuelve la base de datos. */
export interface PlantillaHorarioRow extends RowDataPacket, PlantillaHorarioData {}

/**
 * Datos necesarios para crear una plantilla de horario.
 *
 * No incluye id, created_at ni updated_at porque los genera la base de datos.
 */
export type CreatePlantillaHorarioRow = Pick<
  PlantillaHorarioData,
  "department_id" | "name" | "description" | "weekly_minutes" | "is_active"
>;