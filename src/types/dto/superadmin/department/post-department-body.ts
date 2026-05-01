import { z } from "zod";

export const PostDepartmentBodySchema = z.object({
  name: z.string().min(1).max(150),
}).strict();

export type PostDepartmentBody = z.infer<typeof PostDepartmentBodySchema>;
