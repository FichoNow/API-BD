import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al crear un usuario correctamente. */
export type CreateUserResponse = Pick<
  UserData,
  | "id"
  | "company_id"
  | "group_id"
  | "email"
  | "name"
  | "role"
  | "job_title"
  | "is_active"
>;
