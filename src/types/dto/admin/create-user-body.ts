import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

export type CreateUserBody = Pick<
  UserData,
  "group_id" | "email" | "name" | "role" | "job_title" | "is_active"
> & { password: string };

export const CreateUserBodySchema = createZodObject<CreateUserBody>({
  group_id: z.number(),
  email: z.email().trim().toLowerCase(),
  name: z.string().trim(),
  role: z.enum(["USER", "ADMINISTRATOR"]),
  job_title: z.string().trim(),
  password: z.string(),
  is_active: z.boolean(),
});
