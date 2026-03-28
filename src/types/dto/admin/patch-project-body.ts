import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { ProjectData } from "../../models/project.js";

/** Body del endpoint PATCH /admin/project/:id. Todos los campos son opcionales, pero al menos uno es requerido. */
export type PatchProjectBody = Partial<
  Pick<ProjectData, "group_id" | "name" | "is_active">
>;

/** Schema de validación del body de actualización de proyecto. */
export const PatchProjectBodySchema = createZodObject<PatchProjectBody>({
  group_id: z.number().nullable().optional(),
  name: z.string().trim().optional(),
  is_active: z.boolean().optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
