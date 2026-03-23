import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";

/** Body del endpoint POST /auth/refresh. */
export type PostRefreshBody = {
  refreshToken: string;
};

/** Schema de validación del body de refresh. */
export const PostRefreshBodySchema = createZodObject<PostRefreshBody>({
  refreshToken: z.string(),
});
