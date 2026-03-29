import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-out. */
export type PatchClockOutBody = { clock_out: Date };

/** Schema de validación del body de registro de salida de un fichaje. */
export const PatchClockOutBodySchema = createZodObject<PatchClockOutBody>({
  clock_out: z.coerce.date(),
});
