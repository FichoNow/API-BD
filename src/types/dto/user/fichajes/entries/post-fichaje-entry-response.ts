import { FichajeEntryData } from "../../../../models/fichajes/fichaje-entry.js";

/** Lo que devuelve la API al crear un entry de fichaje correctamente. */
export type PostFichajeEntryResponse = Pick<FichajeEntryData, "id">;