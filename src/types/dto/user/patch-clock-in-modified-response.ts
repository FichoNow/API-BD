import { FichajeData } from "../../models/fichaje.js";

/** Lo que devuelve la API al corregir la hora de entrada de un fichaje correctamente. */
export type PatchClockInModifiedResponse = Pick<
  FichajeData,
  "id" | "clock_in" | "clock_in_modified"
>;
