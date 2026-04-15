import { pool } from "../../pool.js";
import { DiaPlantillaRow } from "../../../types/db/horarios/dia-plantilla-row-type.js";

/**
 * Obtiene todos los días de la semana definidos en una plantilla de horario.
 * Cada día incluye si es laboral, el horario de entrada/salida y los minutos de descanso.
 * @param plantillaId ID de la plantilla de horario.
 * @returns Lista de días de la plantilla ordenados por día de la semana (1=Lun, 7=Dom).
 */
export async function findDiasPlantillaByPlantillaId(
  plantillaId: number,
): Promise<DiaPlantillaRow[]> {
  const [rows] = await pool.query<DiaPlantillaRow[]>(
    "SELECT * FROM dias_plantilla WHERE template_id = ? ORDER BY weekday ASC",
    [plantillaId],
  );

  return rows;
}
