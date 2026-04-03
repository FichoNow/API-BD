import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint PATCH /user/fichajes/:id/entries/:entryId/end. */
export type PatchFichajeEntryEndBody = {
    ended_at: Date;
};

/** Schema de validación del body de cierre de una entry de fichaje. */
export const PatchFichajeEntryEndBodySchema = createZodObject<PatchFichajeEntryEndBody>({
    ended_at: z.coerce.date(),
});