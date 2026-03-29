import { FichajeData } from "../../models/fichaje.js";

// Lo que ddevolverá la API cuando obtenga los fichajes del usuario que se haya autenticado.
export type GetFichajesResponse = Pick<
    FichajeData,
    | "id"
    | "clock_in"
    | "clock_out"
    | "clock_in_modified"
    | "clock_out_modified"
    | "created_at"
>[];
