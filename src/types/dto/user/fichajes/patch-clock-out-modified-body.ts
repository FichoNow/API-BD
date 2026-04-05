import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { FichajeData } from "../../../models/fichaje.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-out/modified. */
export type PatchClockOutModifiedBody = { clock_out: NonNullable<FichajeData["clock_out"]> };

/** Schema de validación del body de corrección de la hora de salida de un fichaje. */
export const PatchClockOutModifiedBodySchema = createZodObject<PatchClockOutModifiedBody>({
  clock_out: z.coerce.date(),
});
