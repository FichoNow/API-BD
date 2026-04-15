import { pool } from "../../pool.js";
import { PlantillaHorarioRow } from "../../../types/db/horarios/plantilla-horario-row-type.js";

/**
 * Busca una plantilla de horario por su ID.
 * @param plantillaId ID de la plantilla a buscar.
 * @returns La plantilla encontrada o null si no existe.
 */
export async function findPlantillaHorarioById(
  plantillaId: number,
): Promise<PlantillaHorarioRow | null> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    "SELECT * FROM plantillas_horario WHERE id = ? LIMIT 1",
    [plantillaId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Obtiene todas las plantillas de horario activas de una empresa, ordenadas por nombre.
 * @param companyId ID de la empresa.
 * @returns Lista de plantillas activas ordenadas alfabéticamente.
 */
export async function findPlantillasHorarioByCompanyId(
  companyId: number,
): Promise<PlantillaHorarioRow[]> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    "SELECT * FROM plantillas_horario WHERE company_id = ? AND is_active = TRUE ORDER BY name ASC",
    [companyId],
  );

  return rows;
}
