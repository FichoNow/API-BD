import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al actualizar un usuario correctamente (usado por el admin). */
export type UpdateUserResponse = Pick<
  UserData,
  | "id"
  | "name"
  | "email"
  | "role"
  | "group_id"
  | "is_active"
  | "must_change_password"
  | "updated_at"
>;
