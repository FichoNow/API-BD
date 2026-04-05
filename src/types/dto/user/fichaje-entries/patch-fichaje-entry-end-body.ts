import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { FichajeEntryData } from "../../../models/fichaje-entry.js";

/** Body del endpoint PATCH /user/fichajes/:id/entries/:entryId/end. */
export type PatchFichajeEntryEndBody = { ended_at: NonNullable<FichajeEntryData["ended_at"]> };

/** Schema de validación del body de cierre de una entry de fichaje. */
export const PatchFichajeEntryEndBodySchema = createZodObject<PatchFichajeEntryEndBody>({
    ended_at: z.coerce.date(),
});