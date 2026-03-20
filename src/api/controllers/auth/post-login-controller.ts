import { Request, Response } from "express";
import { loginUser } from "../../../services/login-service.js";
import { PostLoginBody } from "../../../types/dto/endpoints/auth/post-login-body.js";
import { PostLoginResponse } from "../../../types/dto/endpoints/auth/post-login-response.js";
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
  const { email, password } = req.body;

  // Verificamos que email/password sean string (true: eliminamos espacios / false: mandamos vacio)
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanPassword = typeof password === "string" ? password.trim() : "";

  //email/password vacios, error
  if (!cleanEmail || !cleanPassword) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await loginUser(cleanEmail, cleanPassword);

  if (!data) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  return res.status(200).json({ data });
}
