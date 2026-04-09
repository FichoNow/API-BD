import { FichajeBreakData } from "../../../../models/fichajes/fichaje-break.js";

/** Lo que devuelve la API al crear un break. */
export type PostFichajeBreakResponse = Pick<FichajeBreakData, "id">;
