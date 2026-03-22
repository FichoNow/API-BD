import { RowDataPacket } from "mysql2";
import { UserData } from "../models/user.js";

/** Representa una fila de la tabla `users` tal como la devuelve la base de datos. */
export interface UserRow extends RowDataPacket, UserData {}

export type UpdateUserRow = Partial<
  Pick<
    UserData,
    | "group_id"
    | "email"
    | "name"
    | "role"
    | "job_title"
    | "password_hash"
    | "is_active"
  >
>;

export type CreateUserRow = Pick<
  UserData,
  | "company_id"
  | "group_id"
  | "email"
  | "name"
  | "role"
  | "job_title"
  | "password_hash"
  | "is_active"
>;

