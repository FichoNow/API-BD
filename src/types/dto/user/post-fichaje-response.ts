import { FichajeData } from "../../models/fichaje.js";

/** Lo que devuelve la API al crear un fichaje correctamente. */
export type PostFichajeResponse = Pick<
  FichajeData,
  "id" | "user_id" | "clock_in" | "created_at"
>;
