import * as z from "zod";

/**
 * Body del endpoint POST /auth/register.
 *
 * Contiene los datos de la empresa a crear y los del usuario que será SUPERADMIN.
 * Este endpoint es público — no requiere autenticación previa.
 */
export type PostRegisterBody = {
  company: {
    name: string;
    cif_nif: string;
    email: string;
    address_line: string;
    city: string;
    postal_code: string;
  };
  user: {
    name: string;
    email: string;
    password: string;
  };
};

/** Schema de validación del body de registro. */
export const PostRegisterBodySchema = z.object({
  company: z.object({
    name: z.string().trim().min(1).max(150),
    cif_nif: z.string().trim().min(1).max(20),
    email: z.email().trim().toLowerCase(),
    address_line: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(100),
    postal_code: z.string().trim().min(1).max(10),
  }),
  user: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8),
  }),
});
