import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";

export type PostLoginBody = {
  email: string;
  password: string;
};

export const PostLoginBodySchema = createZodObject<PostLoginBody>({
  email: z.email().trim().toLowerCase(),
  password: z.string(),
});