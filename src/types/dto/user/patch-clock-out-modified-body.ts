import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-out/modified. */
export interface PatchClockOutModifiedBody {
  clock_out: Date;
}

/** Schema de validación del body de corrección de la hora de salida de un fichaje. */
export const PatchClockOutModifiedBodySchema = createZodObject<PatchClockOutModifiedBody>({
  clock_out: z.coerce.date(),
});
