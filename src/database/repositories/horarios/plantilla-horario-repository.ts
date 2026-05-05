import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../pool.js";
import { 
  PlantillaHorarioRow,
  CreatePlantillaHorarioRow,
} from "../../../types/db/horarios/plantilla-horario-row-type.js";

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
export async function findPlantillasHorarioByDepartmentId(
  departmentId: number,
): Promise<PlantillaHorarioRow[]> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    "SELECT * FROM plantillas_horario WHERE department_id = ? AND is_active = TRUE ORDER BY name ASC",
    [departmentId],
  );

  return rows;
}

/**
 * Obtiene todas las plantillas de horario de un departamento.
 *
 * A diferencia de findPlantillasHorarioByDepartmentId, esta función no filtra
 * solo por activas, porque desde el panel admin interesa poder ver también
 * plantillas inactivas.
 */
export async function findAllPlantillasHorarioByDepartmentId(
  departmentId: number,
): Promise<PlantillaHorarioRow[]> {
  const [rows] = await pool.query<PlantillaHorarioRow[]>(
    `SELECT *
     FROM plantillas_horario
     WHERE department_id = ?
     ORDER BY created_at DESC`,
    [departmentId],
  );

  return rows;
}

/**
 * Crea una nueva plantilla de horario.
 * 
 * Devuelve el ID de la plantilla creada.
 */
export async function createPlantillaHorario(
  data: CreatePlantillaHorarioRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO plantillas_horario (
      department_id,
      name,
      description,
      weekly_minutes,
      is_active
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      data.department_id,
      data.name,
      data.description,
      data.weekly_minutes,
      data.is_active,
    ],
  );

  return result.insertId;
}