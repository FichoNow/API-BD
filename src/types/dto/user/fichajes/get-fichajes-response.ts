import { FichajeData } from "../../../models/fichajes/fichaje.js";

// Lo que devolverá la API cuando obtenga los fichajes del usuario autenticado.
export type GetFichajesResponse = Pick<
    FichajeData,
    "id" | "clock_in" | "clock_out"
>[];
