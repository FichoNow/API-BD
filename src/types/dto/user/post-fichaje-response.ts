import { FichajeData } from "../../models/fichaje";

/** Lo que devuelve la API al crear un fichaje correctamente. */
export type PostFichajeResponse = Pick<FichajeData, "id">;
