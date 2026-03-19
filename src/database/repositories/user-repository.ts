import { ResultSetHeader } from "mysql2";
import { DbUser } from "../../types/db/db-user-type.js";
import { pool } from "../pool.js";


export interface CreateUserRepositoryInput {
  company_id: number;
  group_id: number;
  email: string;
  name: string;
  role: "USER" | "ADMINISTRATOR";
  job_title: string;
  password_hash: string;
  is_active: number;
}

export interface CreatedUserRepositoryResult {
  id: number;
  company_id: number;
  group_id: number;
  email: string;
  name: string;
  role: "USER" | "ADMINISTRATOR";
  job_title: string;
  is_active: number;
}


/**
 * Busca un usuario en la base de datos a partir de su email.
 *
 * Ejecuta una consulta SQL sobre la tabla `users` filtrando por el email recibido.
 * Si existe un usuario con ese email, devuelve sus datos en formato `DbUser`.
 * Si no se encuentra ningún usuario, devuelve `null`.
 *
 * @param email Email del usuario que se quiere buscar.
 * @returns El usuario encontrado o `null` si no existe.
 */
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const [rows] = await pool.query<DbUser[]>(
    "SELECT id, email, name, role, password_hash, is_active FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (!rows.length) {
    return null;
  }

  return rows[0];
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

/**
 * Insertar un usuario nuevo en la base de datos.
 * 
 * Esta función solo guarda los datos recibidos.
 * La contraseña ya debe venir hasheada desde el service.
 * 
 * @params userData Datos del usuario a crear.
 * @return Datos básicos del usuario creado.
 */
export async function createUser(userDate: CreateUserRepositoryInput, ): Promise<CreatedUserRepositoryResult> {
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
        userDate.company_id,
        userDate.group_id,
        userDate.email,
        userDate.name,
        userDate.role,
        userDate.job_title,
        userDate.password_hash,
        userDate.is_active,
      ],
  );

  return {
    id: result.insertId,
    company_id: userDate.company_id,
    group_id: userDate.group_id,
    email: userDate.email,
    name: userDate.name,
    role: userDate.role,
    job_title: userDate.job_title,
    is_active: userDate.is_active,
  };
}
