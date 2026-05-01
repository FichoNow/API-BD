import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GetAdminRequestsResponse } from "../../../../types/dto/admin/requests/get-admin-requests-response.js";
import { getAdminRequestsService } from "../../../../services/admin/requests/get-admin-requests-service.js";

/**
 * Controller del endpoint GET /admin/requests.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el query param `departmentId`.
 * 2. Delegar al service `getAdminRequestsService`.
 * 3. Devolver 200 con la lista de solicitudes del departamento.
 */
export async function getAdminRequestsController(
  req: Request,
  res: Response<BodyResponse<GetAdminRequestsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError(
      "El parámetro departmentId es requerido y debe ser un número válido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await getAdminRequestsService(departmentId, req.jwtClaims!);

  return res.status(200).json({ data });
}