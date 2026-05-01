import { z } from "zod";

export const PostSuperadminBodySchema = z.object({
  name:     z.string().min(1).max(150),
  email:    z.string().email(),
  password: z.string().min(6),
}).strict();

export type PostSuperadminBody = z.infer<typeof PostSuperadminBodySchema>;
