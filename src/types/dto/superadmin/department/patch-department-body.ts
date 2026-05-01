import { z } from "zod";

export const PatchDepartmentBodySchema = z.object({
  name: z.string().min(1).max(150),
}).strict();

export type PatchDepartmentBody = z.infer<typeof PatchDepartmentBodySchema>;
