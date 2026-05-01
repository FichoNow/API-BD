import * as z from "zod";
import { createZodObject } from "../../../../helpers/zod-helper.js";
import { WorkGroupData } from "../../../models/work-group.js";

/** Body del endpoint POST /admin/group. */
export type CreateGroupBody = Pick<WorkGroupData, "department_id" | "name">;

/** Schema de validación del body de creación de grupo. */
export const CreateGroupBodySchema = createZodObject<CreateGroupBody>({
  department_id: z.number(),
  name: z.string().trim().min(1),
});
