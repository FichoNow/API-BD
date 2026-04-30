import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteGroupService } from "../../../../services/admin/groups/delete-group-service.js";

export async function deleteGroupController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<{ id: number }>>,
) {
  const groupId = Number(req.params.id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    throw new ResponseError("ID de grupo no válido", 400, "INVALID_GROUP_ID");
  }

  const data = await deleteGroupService(groupId, req.jwtClaims!);
  return res.status(200).json({ data });
}
