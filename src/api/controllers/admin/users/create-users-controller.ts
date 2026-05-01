import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { CreateUsersResponse } from "../../../../types/dto/admin/users/create-users-response.js";
import {
  CreateUsersBody,
  CreateUsersBodySchema,
} from "../../../../types/dto/admin/users/create-users-body.js";
import { createUsersService } from "../../../../services/admin/users/create-users-service.js";

/**
 * Controller encargado de gestionar la creación de un usuario nuevo.
 *
 * Su responsabilidad es:
 * - leer el body de la petición
 * - validar que estén todos los campos obligatorios
 * - llamar al service correspondiente
 * - devolver la respuesta HTTP adecuada
 */
export async function createUsersController(
  req: Request<unknown, unknown, CreateUsersBody>,
  res: Response<BodyResponse<CreateUsersResponse>>,
) {
  const parsed = CreateUsersBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createUsersService(parsed.data as CreateUsersBody, req.jwtClaims!);

  res.status(201).json({ data });
}
