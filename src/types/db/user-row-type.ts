import { RowDataPacket } from "mysql2";

/** Roles posibles de un usuario en el sistema. */
export type UserRole = "USER" | "ADMINISTRATOR";

/** Representa una fila de la tabla `users` tal como la devuelve la base de datos. */
export interface UserRow extends RowDataPacket {
  id: number;
  company_id: number | null;
  group_id: number | null;
  email: string;
  name: string;
  role: UserRole;
  job_title: string | null;
  password_hash: string | null;
  is_active: boolean;
  last_login_at: Date | null;
  updated_at: Date | null;
  created_at: Date | null;
}
