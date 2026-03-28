import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

/** Body del endpoint POST /admin/user. */
export type CreateUserBody = Pick<
  UserData,
  "group_id" | "email" | "name" | "role" | "is_active"
> & { password: string };

/** Schema de validación del body de creación de usuario. */
export const CreateUserBodySchema = createZodObject<CreateUserBody>({
  group_id: z.number().nullable(),
  email: z.email().trim().toLowerCase(),
  name: z.string().trim(),
  role: z.enum(["USER", "ADMINISTRATOR"]),
  password: z.string(),
  is_active: z.boolean(),
});
