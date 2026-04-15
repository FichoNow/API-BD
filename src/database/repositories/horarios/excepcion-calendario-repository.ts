import { format, startOfMonth, endOfMonth } from "date-fns";
import { pool } from "../../pool.js";
import { ExcepcionCalendarioRow } from "../../../types/db/horarios/excepcion-calendario-row-type.js";

/**
 * Obtiene todas las excepciones de calendario que afectan a un usuario en un mes concreto.
 * Incluye excepciones globales de la empresa (sin user_id ni group_id),
 * las del grupo del usuario y las individuales del propio usuario.
 * @param companyId ID de la empresa.
 * @param userId ID del usuario.
 * @param grupoId ID del grupo del usuario (puede ser null).
 * @param year Año del mes a consultar.
 * @param month Mes a consultar (1-12).
 * @returns Lista de excepciones ordenadas por start_date ascendente.
 */
export async function findExcepcionesCalendarioByMonth(
  companyId: number,
  userId: number,
  grupoId: number | null,
  year: number,
  month: number,
): Promise<ExcepcionCalendarioRow[]> {
  const date = new Date(year, month - 1);
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");

  const [rows] = await pool.query<ExcepcionCalendarioRow[]>(
    `SELECT * FROM excepciones_calendario
     WHERE company_id = ?
       AND start_date <= ?
       AND end_date >= ?
       AND (
         user_id = ?
         OR (group_id = ? AND user_id IS NULL)
         OR (user_id IS NULL AND group_id IS NULL)
       )
     ORDER BY start_date ASC`,
    [companyId, end, start, userId, grupoId],
  );

  return rows;
}
