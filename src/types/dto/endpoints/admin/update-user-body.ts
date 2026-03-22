import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { UserRow } from "../../../db/user-row-type.js";

export type UpdateUserBody = Partial<
  Pick<
    UserRow,
    "group_id" | "email" | "name" | "role" | "job_title" | "is_active"
  >
> & { password?: string };

export const UpdateUserBodySchema = createZodObject<UpdateUserBody>({
  group_id: z.number().optional(),
  email: z.email().trim().toLowerCase().optional(),
  name: z.string().trim().optional(),
  role: z.enum(["USER", "ADMINISTRATOR"]).optional(),
  job_title: z.string().trim().optional(),
  password: z.string().optional(),
  is_active: z.boolean().optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
