import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { FichajeData } from "../../models/fichaje.js";

/** Body del endpoint POST /user/fichaje. */
export type PostFichajeBody = Pick<FichajeData, "clock_in">;

/** Schema de validación del body de creación de un fichaje. */
export const PostFichajeBodySchema = createZodObject<PostFichajeBody>({
  clock_in: z.coerce.date(),
});
