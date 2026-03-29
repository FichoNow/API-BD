import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint PATCH /user/fichaje/:id/clock-in/modified. */
export interface PatchClockInModifiedBody {
  clock_in: Date;
}

/** Schema de validación del body de corrección de la hora de entrada de un fichaje. */
export const PatchClockInModifiedBodySchema = createZodObject<PatchClockInModifiedBody>({
  clock_in: z.coerce.date(),
});
