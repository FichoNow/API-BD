import { pool } from "../../pool.js";
import { TipoExcepcionRow } from "../../../types/db/horarios/tipo-excepcion-row-type.js";

export async function findAllTiposExcepcion(): Promise<TipoExcepcionRow[]> {
  const [rows] = await pool.query<TipoExcepcionRow[]>(
    "SELECT * FROM tipos_excepcion ORDER BY id ASC",
  );

  return rows;
}

export async function findTipoExcepcionById(
  tipoId: number,
): Promise<TipoExcepcionRow | null> {
  const [rows] = await pool.query<TipoExcepcionRow[]>(
    "SELECT * FROM tipos_excepcion WHERE id = ? LIMIT 1",
    [tipoId],
  );

  return rows.length ? rows[0] : null;
}
