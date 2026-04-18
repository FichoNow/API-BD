import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

/** Body del endpoint PATCH /admin/user/:id. Todos los campos son opcionales, pero al menos uno es requerido. */
export type PatchUserBody = Partial<
  Pick<UserData, "department_id" | "group_id" | "email" | "name" | "role" | "is_active">
> & { password?: string };

/** Schema de validación del body de actualización de usuario por un administrador. */
export const PatchUserBodySchema = createZodObject<PatchUserBody>({
  department_id: z.number().optional(),
  group_id: z.number().nullable().optional(),
  email: z.email().trim().toLowerCase().optional(),
  name: z.string().trim().optional(),
  role: z.enum(["USER", "ADMINISTRATOR"]).optional(),
  password: z.string().optional(),
  is_active: z.boolean().optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
