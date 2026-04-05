import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { UserData } from "../../../models/user.js";

/** Body del endpoint PATCH /user/update. Todos los campos son opcionales, pero al menos uno es requerido. */
export type PatchSelfBody = Partial<Pick<UserData, "email" | "name">> & {
  password?: string;
};

/** Schema de validación del body de actualización del propio perfil. */
export const PatchSelfBodySchema = createZodObject<PatchSelfBody>({
  email: z.email().trim().toLowerCase().optional(),
  name: z.string().trim().optional(),
  password: z.string().optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
