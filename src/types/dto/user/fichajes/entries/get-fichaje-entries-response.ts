import { FichajeEntryData } from "../../../../models/fichajes/fichaje-entry.js";

/** Lo que devuelve la API al obtener las entries de un fichaje concreto.
 * Será un array de entries del fichaje indicado.
 * Devolverá los campos importantes.
 */
export type GetFichajeEntriesResponse = Pick<
    FichajeEntryData,
    "id" | "fichaje_id" | "project_id" | "started_at" | "ended_at"
>[];