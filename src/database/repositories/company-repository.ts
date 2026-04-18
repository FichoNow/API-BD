import { CompanyRow } from "../../types/db/company-row-type.js";
import { pool } from "../pool.js";
import { PatchCompanyBody } from "../../types/dto/superadmin/patch-company-body.js";

export async function findCompanyById(
  companyId: number,
): Promise<CompanyRow | null> {
  const [rows] = await pool.query<CompanyRow[]>(
    "SELECT * FROM companies WHERE id = ? LIMIT 1",
    [companyId],
  );

  return rows.length ? rows[0] : null;
}

export async function updateCompany(
  companyId: number,
  data: PatchCompanyBody,
): Promise<void> {
  const fields = Object.keys(data) as (keyof PatchCompanyBody)[];
  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f]);

  await pool.query(
    `UPDATE companies SET ${setClauses} WHERE id = ?`,
    [...values, companyId],
  );
}
