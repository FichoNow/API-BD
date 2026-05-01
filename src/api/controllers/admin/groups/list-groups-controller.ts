import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GroupsListResponse } from "../../../../types/dto/admin/groups/group-response.js";
import { listGroupsService } from "../../../../services/admin/groups/list-groups-service.js";

export async function listGroupsController(
  req: Request,
  res: Response<BodyResponse<GroupsListResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId) || departmentId <= 0) {
    throw new ResponseError(
      "El parámetro departmentId es requerido y debe ser un número válido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await listGroupsService(departmentId, req.jwtClaims!);
  return res.status(200).json({ data });
}
