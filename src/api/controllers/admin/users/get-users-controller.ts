import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GetUsersResponse } from "../../../../types/dto/admin/get-users-response.js";
import { getUsersService } from "../../../../services/admin/users/get-users-service.js";

/**
 * Controller del endpoint GET /admin/users.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el query param `departmentId`.
 * 2. Delegar al service `getUsersService`.
 * 3. Devolver 200 con la lista de usuarios del departamento.
 */
export async function getUsersController(
  req: Request,
  res: Response<BodyResponse<GetUsersResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError("El parámetro departmentId es requerido y debe ser un número válido", 400, "BAD_REQUEST");
  }

  const data = await getUsersService(departmentId, req.jwtClaims!);

  return res.status(200).json({ data });
}
