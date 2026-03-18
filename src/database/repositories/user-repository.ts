import { UserRow } from "../../types/db/user-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca un usuario en la base de datos a partir de su email.
 *
 * Ejecuta una consulta SQL sobre la tabla `users` filtrando por el email recibido.
 * Si existe un usuario con ese email, devuelve sus datos en formato `UserRow`.
 * Si no se encuentra ningún usuario, devuelve `null`.
 *
 * @param email Email del usuario que se quiere buscar.
 * @returns El usuario encontrado o `null` si no existe.
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Actualiza la fecha y hora del último login correcto de un usuario.
 *
 * Se utiliza normalmente después de que el usuario haya iniciado sesión
 * correctamente, para registrar cuándo fue su último acceso al sistema.
 *
 * @param userId ID del usuario cuyo último login se quiere actualizar.
 */
export async function updateLastLoginAt(userId: number) {
  await pool.query(
    "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [userId],
  );
}
