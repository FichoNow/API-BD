import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

/** Body del endpoint POST /auth/login. */
export type PostLoginBody = Pick<UserData, "email"> & { password: string };

/** Schema de validación del body de login. */
export const PostLoginBodySchema = createZodObject<PostLoginBody>({
  email: z.email().trim().toLowerCase(),
  password: z.string(),
});
