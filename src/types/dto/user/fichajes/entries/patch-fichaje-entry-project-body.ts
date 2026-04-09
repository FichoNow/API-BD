import * as z from "zod";
import { createZodObject } from "../../../../../helpers/zod-helper.js";
import { FichajeEntryData } from "../../../../models/fichajes/fichaje-entry.js";

/** Body del endpoint PATCH /user/fichajes/:id/entries/:entryId/project. */
export type PatchFichajeEntryProjectBody = Pick<FichajeEntryData, "project_id">;

/** Schema de validación del body de cambio de proyecto de una entry. */
export const PatchFichajeEntryProjectBodySchema = createZodObject<PatchFichajeEntryProjectBody>({
  project_id: z.number().int().positive(),
});
