import { Request, Response } from "express";
import { registerCompany } from "../../../services/auth/register-service.js";
import { PostRegisterBody, PostRegisterBodySchema } from "../../../types/dto/auth/post-register-body.js";
import { PostRegisterResponse } from "../../../types/dto/auth/post-register-response.js";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";

/**
 * Controller del endpoint de registro de empresa.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Validar el body con el schema de Zod (datos de empresa + datos del SUPERADMIN).
 * 3. Delegar la lógica de creación al service `registerCompany`.
 * 4. Devolver 201 con los datos básicos de la empresa y el usuario creados.
 */
export async function registerController(
  req: Request<unknown, unknown, PostRegisterBody>,
  res: Response<BodyResponse<PostRegisterResponse>>,
) {
  const parsed = PostRegisterBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const data = await registerCompany(parsed.data as PostRegisterBody);

  return res.status(201).json({ data });
}
