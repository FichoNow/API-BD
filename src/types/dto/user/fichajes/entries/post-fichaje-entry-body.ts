import * as z from "zod";
import { createZodObject } from "../../../../../helpers/zod-helper.js";
import { FichajeEntryData } from "../../../../models/fichaje-entry.js";

/** Body del endpoint POST /user/fichajes/:id/entries. */
export type PostFichajeEntryBody = Pick<FichajeEntryData, "project_id" | "started_at">;

/** Schema de validación del body de creación de una entry de fichaje. */
export const PostFichajeEntryBodySchema = createZodObject<PostFichajeEntryBody>({
    // "coerce" significa: fuerza a convertir el dato como yo quiero.
    project_id: z.coerce.number().int().positive(),
    started_at: z.coerce.date(),
});