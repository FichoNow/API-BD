/** Roles posibles de un usuario en el sistema. */
export type UserRole = "USER" | "ADMINISTRATOR" | "SUPERADMIN";

/** Forma pura de los datos de un usuario, sin index signature de RowDataPacket. */
export interface UserData {
  id: number;
  department_id: number;
  group_id: number | null;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  is_active: boolean;
  must_change_password: boolean;
  last_login_at: Date;
  updated_at: Date;
  created_at: Date;
}
