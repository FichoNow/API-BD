import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { FichajeEntryData } from "../../../models/fichaje-entry.js";

export type PatchFichajeEntryStartBody = { started_at: FichajeEntryData["started_at"] };

export const PatchFichajeEntryStartBodySchema = createZodObject<PatchFichajeEntryStartBody>({
    started_at: z.coerce.date(),
});
