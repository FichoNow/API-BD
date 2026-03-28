import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { ProjectData } from "../../models/project.js";

/** Body del endpoint POST /admin/project. */
export type CreateProjectBody = Pick<
  ProjectData,
  "group_id" | "name" | "is_active"
>;

/** Schema de validación del body de creación de proyecto. */
export const CreateProjectBodySchema = createZodObject<CreateProjectBody>({
  group_id: z.number().nullable(),
  name: z.string().trim(),
  is_active: z.boolean(),
});
