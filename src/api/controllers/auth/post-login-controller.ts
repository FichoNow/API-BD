import { Request, Response } from "express";
import { loginUser } from "../../../services/auth/login-service.js";
import { PostLoginBody, PostLoginBodySchema } from "../../../types/dto/auth/post-login-body.js";
import { PostLoginResponse } from "../../../types/dto/auth/post-login-response.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { BodyResponse } from "../../../types/express/response-type.js";

/**
 * Controller del endpoint de login.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar los datos básicos del body (email y password).
 * 3. Delegar la lógica de autenticación al service `loginUser`.
 * 4. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function loginController(
  req: Request<unknown, unknown, PostLoginBody>,
  res: Response<BodyResponse<PostLoginResponse>>,
) {
  const parsed = PostLoginBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const data = await loginUser(parsed.data as PostLoginBody);

  return res.status(200).json({ data });
}
