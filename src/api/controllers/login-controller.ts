import { Request, Response } from "express";
import { loginUser } from "../../services/login-service.js";
import { AppError } from "../../types/error/app-error-type.js";
import { LoginBody } from "../../types/dto/enpoinds/login-body-dto.js";

/**
 * Controller del endpoint de login.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar los datos básicos del body (email y password).
 * 3. Delegar la lógica de autenticación al service `loginUser`.
 * 4. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body as LoginBody;

  // Verificamos que email/password sean string (true: eliminamos espacios / false: mandamos vacio)
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanPassword = typeof password === "string" ? password.trim() : "";

  //email/password vacios, error
  if (!cleanEmail || !cleanPassword) {
    throw new AppError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const result = await loginUser(cleanEmail, cleanPassword);

  if (!result) {
    throw new AppError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  res.status(200).json(result);
}
