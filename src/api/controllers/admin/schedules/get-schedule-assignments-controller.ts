import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { getScheduleAssignmentsService } from "../../../../services/admin/schedules/get-schedule-assignments-service.js";
import { GetScheduleAssignmentsResponse } from "../../../../types/dto/admin/schedules/get-schedule-assignments-response.js";

/**
 * Controller del endpoint GET /admin/schedule/assignments.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el query param `departmentId`.
 * 2. Delegar al service `getScheduleAssignmentsService`.
 * 3. Devolver 200 con las asignaciones de usuario y de grupo del departamento.
 */
export async function getScheduleAssignmentsController(
  req: Request,
  res: Response<BodyResponse<GetScheduleAssignmentsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError(
      "El parámetro departmentId es requerido y debe ser un número válido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await getScheduleAssignmentsService(departmentId, req.jwtClaims!);

  return res.status(200).json({ data });
}
