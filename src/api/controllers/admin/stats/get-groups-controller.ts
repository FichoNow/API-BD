import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GroupsResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getGroupsService } from "../../../../services/admin/stats/get-groups-service.js";

export async function getGroupsController(
  req: Request,
  res: Response<BodyResponse<GroupsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getGroupsService(departmentId, req.jwtClaims!);
  return res.status(200).json({ data });
}
