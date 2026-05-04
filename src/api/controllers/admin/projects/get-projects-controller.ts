import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { getProjectsService } from "../../../../services/admin/projects/get-projects-service.js";
import { GetProjectsResponse } from "../../../../types/dto/admin/projects/get-projects-response.js";

/**
 * Controller del endpoint GET /admin/projects.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el query param `departmentId`.
 * 2. Delegar al service `getProjectsService`.
 * 3. Devolver 200 con la lista de proyectos del departamento.
 */
export async function getProjectsController(
  req: Request,
  res: Response<BodyResponse<GetProjectsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError("El parámetro departmentId es requerido y debe ser un número válido", 400, "BAD_REQUEST");
  }

  const data = await getProjectsService(departmentId, req.jwtClaims!);

  return res.status(200).json({ data });
}
