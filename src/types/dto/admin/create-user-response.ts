import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al crear un usuario correctamente. */
export type CreateUserResponse = Pick<
  UserData,
  | "id"
  | "department_id"
  | "group_id"
  | "email"
  | "name"
  | "role"
  | "is_active"
  | "must_change_password"
> & { company_id: number };
