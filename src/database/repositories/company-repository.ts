import { CompanyRow } from "../../types/db/company-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca una empresa en la base de datos a partir de su ID.
 *
 * @param companyId ID de la empresa que se quiere buscar.
 * @returns La empresa encontrada o `null` si no existe.
 */
export async function findCompanyById(
  companyId: number,
): Promise<CompanyRow | null> {
  const [rows] = await pool.query<CompanyRow[]>(
    "SELECT * FROM companies WHERE id = ? LIMIT 1",
    [companyId],
  );

  return rows.length ? rows[0] : null;
}
