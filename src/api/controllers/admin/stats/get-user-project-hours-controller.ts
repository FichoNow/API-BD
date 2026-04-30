import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { UserProjectHoursResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getUserProjectHoursService } from "../../../../services/admin/stats/get-user-project-hours-service.js";

export async function getUserProjectHoursController(
  req: Request,
  res: Response<BodyResponse<UserProjectHoursResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const month        = req.query.month   ? Number(req.query.month)   : undefined;
  const year         = req.query.year    ? Number(req.query.year)    : undefined;
  const groupId      = req.query.groupId ? Number(req.query.groupId) : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getUserProjectHoursService(departmentId, req.jwtClaims!, month, year, groupId);
  return res.status(200).json({ data });
}
