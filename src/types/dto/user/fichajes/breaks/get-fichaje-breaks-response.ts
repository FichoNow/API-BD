import { FichajeBreakData } from "../../../../models/fichajes/fichaje-break.js";

/** Lo que devuelve la API al obtener los descansos de un fichaje concreto. */
export type GetFichajeBreaksResponse = Pick<
    FichajeBreakData,
    "id" | "fichaje_id" | "started_at" | "ended_at"
>[];
