import { FichajeEntryData } from "../../models/fichaje-entry.js";

/** Lo que devuelve la API al crear un entry de fichaje correctamente. */
export type PostFichajeEntryResponse = Pick<FichajeEntryData,
"id" | "fichaje_id" | "project_id" | "started_at">; 