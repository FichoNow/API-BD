import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al actualizar el propio perfil correctamente. */
export type PatchSelfResponse = Pick<UserData, "name" | "email">;
