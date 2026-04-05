import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { FichajeData } from "../../../models/fichaje.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-in/modified. */
export type PatchClockInModifiedBody = Pick<FichajeData, "clock_in">;

/** Schema de validación del body de corrección de la hora de entrada de un fichaje. */
export const PatchClockInModifiedBodySchema = createZodObject<PatchClockInModifiedBody>({
  clock_in: z.coerce.date(),
});
