import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al listar los usuarios de un departamento. */
export type GetUsersResponse = Array<
  Pick<UserData, "id" | "name" | "email" | "role" | "is_active" | "must_change_password" | "group_id">
>;
