import { pool } from "../../pool.js";
import { DiaPlantillaRow } from "../../../types/db/horarios/dia-plantilla-row-type.js";

export async function findDiasPlantillaByPlantillaId(
  plantillaId: number,
): Promise<DiaPlantillaRow[]> {
  const [rows] = await pool.query<DiaPlantillaRow[]>(
    "SELECT * FROM dias_plantilla WHERE template_id = ? ORDER BY weekday ASC",
    [plantillaId],
  );

  return rows;
}
