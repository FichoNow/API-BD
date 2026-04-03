import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Query params del endpoint GET /user/fichajes-entries. */
export type GetFichajeEntriesQuery = {
    fichaje_id: number;
};

/** Schema de validación de la query para obtener las entries de un fichaje. */
export const GetFichajeEntriesQuerySchema = createZodObject<GetFichajeEntriesQuery>({
    fichaje_id: z.coerce.number().int().positive(),
});