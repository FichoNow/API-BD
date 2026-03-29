import { FichajeData } from "../../models/fichaje.js";

/** Lo que devuelve la API al corregir la hora de salida de un fichaje correctamente. */
export type PatchClockOutModifiedResponse = Pick<
  FichajeData,
  "id" | "clock_out" | "clock_out_modified"
>;
