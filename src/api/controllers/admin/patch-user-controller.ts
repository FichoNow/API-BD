import { Request, Response } from "express";
import { AppError } from "../../../types/error/app-error-type.js";
import { UpdateUserBody } from "../../../types/dto/enpoinds/admin/patch-user-body.js";

/**
 * Controller del endpoint de login.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar los datos básicos del body (email y password).
 * 3. Delegar la lógica de autenticación al service `loginUser`.
 * 4. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function userController(
  req: Request<{ id: string }, any, UpdateUserBody>,
  res: Response,
) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError("ID de usuario no válido", 400, "INVALID_USER_ID");
  }

  const body = req.body;
}
