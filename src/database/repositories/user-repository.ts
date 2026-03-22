import { ResultSetHeader } from "mysql2/promise";
import { UpdateUserRow, UserRow } from "../../types/db/user-row-type.js";

import { pool } from "../pool.js";

export interface CreateUserRepositoryInput {
  company_id: number;
  group_id: number;
  email: string;
  name: string;
  role: "USER" | "ADMINISTRATOR";
  job_title: string;
  password_hash: string;
  is_active: boolean;
}

export interface CreatedUserRepositoryResult {
  id: number;
  company_id: number;
  group_id: number;
  email: string;
  name: string;
  role: "USER" | "ADMINISTRATOR";
  job_title: string;
  is_active: boolean;
}

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
 * @param userData Datos del usuario a crear.
 * @returns Datos básicos del usuario creado.
 */
export async function createUser(
  userData: CreateUserRepositoryInput,
): Promise<CreatedUserRepositoryResult> {
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
      created_at,
      updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
    [
      userData.company_id,
      userData.group_id,
      userData.email,
      userData.name,
      userData.role,
      userData.job_title,
      userData.password_hash,
      userData.is_active,
    ],
  );

  return {
    id: result.insertId,
    company_id: userData.company_id,
    group_id: userData.group_id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    job_title: userData.job_title,
    is_active: userData.is_active,
  };
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

  if (!entries.length) return false;

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = [...entries.map(([, v]) => v), userId];

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE users SET ${setClause} WHERE id = ? LIMIT 1`,
    values,
  );

  return result.affectedRows > 0;
}
