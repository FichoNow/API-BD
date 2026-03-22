import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

export type PostLoginBody = {
  email: UserData["email"];
  password: string;
};

export const PostLoginBodySchema = createZodObject<PostLoginBody>({
  email: z.email().trim().toLowerCase(),
  password: z.string(),
});
