import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import {
  PatchGroupBody,
  PatchGroupBodySchema,
} from "../../../../types/dto/admin/groups/patch-group-body.js";
import { GroupResponse } from "../../../../types/dto/admin/groups/group-response.js";
import { updateGroupService } from "../../../../services/admin/groups/update-group-service.js";

export async function patchGroupController(
  req: Request<{ id: string }, unknown, PatchGroupBody>,
  res: Response<BodyResponse<GroupResponse>>,
) {
  const groupId = Number(req.params.id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    throw new ResponseError("ID de grupo no válido", 400, "INVALID_GROUP_ID");
  }

  const parsed = PatchGroupBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const data = await updateGroupService(groupId, parsed.data as PatchGroupBody, req.jwtClaims!);
  return res.status(200).json({ data });
}
