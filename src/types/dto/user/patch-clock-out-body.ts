import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { FichajeData } from "../../models/fichaje.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-out. */
export type PatchClockOutBody = { clock_out: NonNullable<FichajeData["clock_out"]> };

/** Schema de validación del body de registro de salida de un fichaje. */
export const PatchClockOutBodySchema = createZodObject<PatchClockOutBody>({
  clock_out: z.coerce.date(),
});
