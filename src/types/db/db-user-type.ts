import { RowDataPacket } from "mysql2";
export type UserRole = "USER" | "ADMINISTRATOR";

// Interfaz del usuario, para tipar la ROW
export interface DbUser extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  is_active: number;
}
