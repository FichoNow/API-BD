import { Request, Response } from "express";
import { createUserService } from "../../../../services/admin/users/create-user-service.js";
import {
  CreateUserBody,
  CreateUserBodySchema,
} from "../../../../types/dto/admin/users/create-user-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { CreateUserResponse } from "../../../../types/dto/admin/users/create-user-response.js";

/**
 * Controller encargado de gestionar la creación de un usuario nuevo.
 *
 * Su responsabilidad es:
 * - leer el body de la petición
 * - validar que estén todos los campos obligatorios
 * - llamar al service correspondiente
 * - devolver la respuesta HTTP adecuada
 */
export async function createUserController(
  req: Request<unknown, unknown, CreateUserBody>,
  res: Response<BodyResponse<CreateUserResponse>>,
) {
  const parsed = CreateUserBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createUserService(parsed.data as CreateUserBody, req.jwtClaims!);

  res.status(201).json({ data });
}
