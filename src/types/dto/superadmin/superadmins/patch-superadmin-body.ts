import * as z from "zod";

export interface PatchSuperadminBody {
  name?: string;
  email?: string;
}

export const PatchSuperadminBodySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.email().trim().toLowerCase().optional(),
  })
  .refine((body) => Object.values(body).some((v) => v !== undefined), {
    message: "El cuerpo de la solicitud no puede estar vacío.",
  });
