import { pool } from "../../pool.js";
import { PlantillaHorarioRow } from "../../../types/db/horarios/plantilla-horario-row-type.js";

export async function findPlantillaHorarioById(
  plantillaId: number,
): Promise<PlantillaHorarioRow | null> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    "SELECT * FROM plantillas_horario WHERE id = ? LIMIT 1",
    [plantillaId],
  );

  return rows.length ? rows[0] : null;
}

export async function findPlantillasHorarioByCompanyId(
  companyId: number,
): Promise<PlantillaHorarioRow[]> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    "SELECT * FROM plantillas_horario WHERE company_id = ? AND is_active = TRUE ORDER BY name ASC",
    [companyId],
  );

  return rows;
}
