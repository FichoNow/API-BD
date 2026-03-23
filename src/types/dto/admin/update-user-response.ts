import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al actualizar un usuario correctamente (usado por el admin). */
export type UpdateUserResponse = Pick<
  UserData,
  | "id"
  | "name"
  | "email"
  | "role"
  | "job_title"
  | "group_id"
  | "is_active"
  | "updated_at"
>;
