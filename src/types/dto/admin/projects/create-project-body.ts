import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { ProjectData } from "../../../models/project.js";

/** Body del endpoint POST /admin/project. */
export type CreateProjectBody = Pick<
  ProjectData,
  "department_id" | "group_id" | "name" | "is_active"
>;

/** Schema de validación del body de creación de proyecto. */
export const CreateProjectBodySchema = createZodObject<CreateProjectBody>({
  department_id: z.number(),
  group_id: z.number().nullable(),
  name: z.string().trim(),
  is_active: z.boolean(),
});
