import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { getSchedulesService } from "../../../../services/admin/schedules/get-schedules-service.js";
import { GetSchedulesResponse } from "../../../../types/dto/admin/schedules/get-schedules-response.js";

/**
 * Controller del endpoint GET /admin/schedules.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el query param `departmentId`.
 * 2. Delegar al service `getSchedulesService`.
 * 3. Devolver 200 con las plantillas de horario del departamento.
 */
export async function getSchedulesController(
  req: Request,
  res: Response<BodyResponse<GetSchedulesResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError(
      "El parámetro departmentId es requerido y debe ser un número válido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await getSchedulesService(departmentId, req.jwtClaims!);

  return res.status(200).json({ data });
}