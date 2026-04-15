import {
  CreateRefreshTokenRow,
  RefreshTokenRow,
} from "../../types/db/refresh-token-row-type.js";
import { pool } from "../pool.js";
import { ResultSetHeader } from "mysql2";

/**
 * Crea un nuevo refresh token en la base de datos.
 * @param data Datos del token (user_id, token_hash, expires_at).
 * @returns ID del registro recién creado.
 */
export async function createRefreshToken(
  data: CreateRefreshTokenRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      expires_at,
      created_at
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [data.user_id, data.token_hash, data.expires_at],
  );

  return result.insertId;
}

/**
 * Busca un refresh token por su hash.
 * Se usa para validar el token que llega en la petición de refresco.
 * @param tokenHash Hash del token a buscar.
 * @returns El token encontrado o null si no existe.
 */
export async function findRefreshTokenByHash(
  tokenHash: string,
): Promise<RefreshTokenRow | null> {
  const [rows] = await pool.query<RefreshTokenRow[]>(
    `SELECT *
     FROM refresh_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Busca el refresh token activo de un usuario por su ID.
 * Cada usuario solo puede tener un refresh token activo a la vez.
 * @param userId ID del usuario.
 * @returns El token encontrado o null si el usuario no tiene sesión activa.
 */
export async function findRefreshTokenByUserId(
  userId: number,
): Promise<RefreshTokenRow | null> {
  const [rows] = await pool.query<RefreshTokenRow[]>(
    `SELECT *
     FROM refresh_tokens
     WHERE user_id = ?
     LIMIT 1`,
    [userId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Actualiza el hash y la fecha de expiración del refresh token de un usuario.
 * Se usa durante la rotación del token para reemplazar el token antiguo.
 * @param userId ID del usuario cuyo token se va a rotar.
 * @param data Nuevo hash y nueva fecha de expiración.
 */
export async function updateRefreshTokenByUserId(
  userId: number,
  data: Pick<CreateRefreshTokenRow, "token_hash" | "expires_at">,
): Promise<void> {
  await pool.query<ResultSetHeader>(
    `UPDATE refresh_tokens
     SET token_hash = ?, expires_at = ?
     WHERE user_id = ?`,
    [data.token_hash, data.expires_at, userId],
  );
}

/**
 * Elimina un refresh token de la base de datos por su hash.
 * @param tokenHash Hash del token a eliminar.
 * @returns true si se eliminó el token, false si no existía.
 */
export async function deleteRefreshTokenByHash(
  tokenHash: string,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM refresh_tokens WHERE token_hash = ?`,
    [tokenHash],
  );

  return result.affectedRows > 0;
}

/**
 * Elimina el refresh token de un usuario por su ID.
 * Se usa al hacer logout para invalidar la sesión.
 * @param userId ID del usuario cuyo token se va a eliminar.
 * @returns true si se eliminó el token, false si el usuario no tenía sesión activa.
 */
export async function deleteRefreshTokenByUserId(
  userId: number,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM refresh_tokens WHERE user_id = ?`,
    [userId],
  );

  return result.affectedRows > 0;
}
