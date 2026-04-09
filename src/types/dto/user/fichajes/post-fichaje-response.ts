import { FichajeData } from "../../../models/fichajes/fichaje.js";

/** Lo que devuelve la API al crear un fichaje correctamente. */
export type PostFichajeResponse = Pick<FichajeData, "id">;
