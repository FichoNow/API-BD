import * as z from "zod";
import { CreateUserBodySchema } from "./create-user-body.js";

/** Body del endpoint POST /admin/users. Array de usuarios a crear. */
export type CreateUsersBody = z.infer<typeof CreateUsersBodySchema>;

/** Schema de validación del body de creación masiva de usuarios. */
export const CreateUsersBodySchema = CreateUserBodySchema.array()
  .min(2)
  .max(50);
