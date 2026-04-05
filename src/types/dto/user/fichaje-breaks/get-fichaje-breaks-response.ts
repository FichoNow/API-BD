import { FichajeBreakData } from "../../../models/fichaje-break.js";

/** Lo que devuelve la API al obtener los breaks de un fichaje. */
export type GetFichajeBreaksResponse = Pick<
  FichajeBreakData,
  "id" | "fichaje_id" | "started_at" | "ended_at"
>[];
