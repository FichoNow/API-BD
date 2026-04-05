import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { FichajeBreakData } from "../../../models/fichaje-break.js";

/** Body del endpoint PATCH /user/fichajes/:id/breaks/:breakId/end. */
export type PatchFichajeBreakEndBody = { ended_at: NonNullable<FichajeBreakData["ended_at"]> };

export const PatchFichajeBreakEndBodySchema = createZodObject<PatchFichajeBreakEndBody>({
  ended_at: z.coerce.date(),
});
