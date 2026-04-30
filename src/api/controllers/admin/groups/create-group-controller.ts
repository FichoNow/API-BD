import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import {
  CreateGroupBody,
  CreateGroupBodySchema,
} from "../../../../types/dto/admin/create-group-body.js";
import { GroupResponse } from "../../../../types/dto/admin/group-response.js";
import { createGroupService } from "../../../../services/admin/groups/create-group-service.js";

export async function createGroupController(
  req: Request<unknown, unknown, CreateGroupBody>,
  res: Response<BodyResponse<GroupResponse>>,
) {
  const parsed = CreateGroupBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const data = await createGroupService(parsed.data as CreateGroupBody, req.jwtClaims!);
  res.status(201).json({ data });
}
