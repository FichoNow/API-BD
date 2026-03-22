import { RowDataPacket } from "mysql2";

/** Roles posibles de un usuario en el sistema. */
export type UserRole = "USER" | "ADMINISTRATOR";

/** Representa una fila de la tabla `users` tal como la devuelve la base de datos. */
export interface UserRow extends RowDataPacket {
  id: number;
  company_id: number;
  group_id: number;
  email: string;
  name: string;
  role: UserRole;
  job_title: string;
  password_hash: string;
  is_active: boolean;
  last_login_at: Date;
  updated_at: Date;
  created_at: Date;
}

export type UpdateUserRow = Partial<
  Pick<
    UserRow,
    | "group_id"
    | "email"
    | "name"
    | "role"
    | "job_title"
    | "password_hash"
    | "is_active"
  >
>;
