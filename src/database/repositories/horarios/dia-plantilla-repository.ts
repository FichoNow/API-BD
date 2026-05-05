import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../pool.js";
import { 
  DiaPlantillaRow,
  CreateDiaPlantillaRow, 
} from "../../../types/db/horarios/dia-plantilla-row-type.js";

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

/**
 * Crea un día dentro de una plantilla de horario.
 *
 * Se usa al crear una plantilla completa con sus días de lunes a domingo.
 */
export async function createDiaPlantilla(
  data: CreateDiaPlantillaRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO dias_plantilla (
      template_id,
      weekday,
      is_working_day,
      start_time,
      end_time,
      break_minutes
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.template_id,
      data.weekday,
      data.is_working_day,
      data.start_time,
      data.end_time,
      data.break_minutes,
    ],
  );

  return result.insertId;
}
