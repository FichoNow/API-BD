import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { WorkGroupData } from "../../../models/work-group.js";

/** Body del endpoint PATCH /admin/group/:id. */
export type PatchGroupBody = Partial<Pick<WorkGroupData, "name">>;

/** Schema de validación del body de actualización de grupo. */
export const PatchGroupBodySchema = createZodObject<PatchGroupBody>({
  name: z.string().trim().min(1).optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
