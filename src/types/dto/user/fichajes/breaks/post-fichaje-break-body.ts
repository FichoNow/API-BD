import * as z from "zod";
import { createZodObject } from "../../../../../helpers/zod-helper.js";
import { FichajeBreakData } from "../../../../models/fichajes/fichaje-break.js";

/** Body del endpoint POST /user/fichajes/:id/breaks. */
export type PostFichajeBreakBody = Pick<FichajeBreakData, "started_at">;

export const PostFichajeBreakBodySchema = createZodObject<PostFichajeBreakBody>({
  started_at: z.coerce.date(),
});
