import { WorkGroupRow } from "../../types/db/work-group-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca un grupo de trabajo en la base de datos a partir de su ID.
 *
 * @param groupId ID del grupo que se quiere buscar.
 * @returns El grupo encontrado o `null` si no existe.
 */
export async function findGroupById(
  groupId: number,
): Promise<WorkGroupRow | null> {
  const [rows] = await pool.query<WorkGroupRow[]>(
    "SELECT * FROM work_groups WHERE id = ? LIMIT 1",
    [groupId],
  );

  return rows.length ? rows[0] : null;
}
