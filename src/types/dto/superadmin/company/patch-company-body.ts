import { z } from "zod";

export const PatchCompanyBodySchema = z.object({
  name: z.string().min(1).max(150).optional(),
  cif_nif: z.string().min(1).max(20).optional(),
  email: z.string().email().optional(),
  address_line: z.string().min(1).max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  postal_code: z.string().min(1).max(10).optional(),
  is_active: z.boolean().optional(),
}).strict();

export type PatchCompanyBody = z.infer<typeof PatchCompanyBodySchema>;
