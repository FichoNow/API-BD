import { ResultSetHeader } from "mysql2/promise";
import {
  CreateUserRow,
  UpdateUserRow,
  UserRow,
} from "../../types/db/user-row-type.js";

import { pool } from "../pool.js";

/**
 * Busca un usuario en la base de datos a partir de su ID.
 *
 * @param userId ID del usuario que se quiere buscar.
 * @returns El usuario encontrado o `null` si no existe.
 */
export async function findUserById(userId: number): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [userId],
  );

  return rows.length ? rows[0] : null;
}

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
 * @returns Promise que resuelve cuando la actualización se ha completado.
 */
export async function updateLastLoginAt(userId: number) {
  await pool.query(
    "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [userId],
  );
}

/**
 * Insertar un usuario nuevo en la base de datos.
 *
 * Esta función solo guarda los datos recibidos.
 * La contraseña ya debe venir hasheada desde el service.
 *
 * @param data Datos del usuario a crear.
 * @returns Datos básicos del usuario creado.
 */
export async function createUser(data: CreateUserRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (
      company_id,
      group_id,
      email,
      name,
      role,
      job_title,
      password_hash,
      is_active,
      must_change_password,
      created_at,
      updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
    [
      data.company_id,
      data.group_id,
      data.email,
      data.name,
      data.role,
      data.job_title,
      data.password_hash,
      data.is_active,
      data.must_change_password,
    ],
  );

  return result.insertId;
}

/** Actualiza los campos de un usuario en la base de datos.
 *
 * Construye dinámicamente el SET de la query a partir de los campos presentes en `data`.
 * Si no hay ningún campo, devuelve `false` sin ejecutar ninguna query.
 *
 * @param userId ID del usuario a actualizar.
 * @param data Campos a actualizar. Solo se incluyen los que estén definidos.
 * @returns `true` si se actualizó alguna fila, `false` si no.
 */
export async function updateUserById(
  userId: number,
  data: UpdateUserRow,
): Promise<boolean> {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = [...entries.map(([, v]) => v), userId];

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE users SET ${setClause} WHERE id = ? LIMIT 1`,
    values,
  );

  return result.affectedRows > 0;
}
