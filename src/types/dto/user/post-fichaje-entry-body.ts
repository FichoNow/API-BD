import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint POST /user/fichajes/:id/entries. */
export type PostFichajeEntryBody = {
    project_id: number;
    started_at: Date;
};

/** Schema de validación del body de creación de una entry de fichaje. */
export const PostFichajeEntryBodySchema = createZodObject<PostFichajeEntryBody>({
    // "coerce" significa: fuerza a convertir el dato como yo quiero.
    project_id: z.coerce.number().int().positive(),
    started_at: z.coerce.date(),
});