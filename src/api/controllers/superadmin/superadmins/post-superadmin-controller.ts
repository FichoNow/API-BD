import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { PostSuperadminBody, PostSuperadminBodySchema } from "../../../../types/dto/superadmin/superadmins/post-superadmin-body.js";
import { PostSuperadminResponse } from "../../../../types/dto/superadmin/superadmins/post-superadmin-response.js";
import { createSuperadminService } from "../../../../services/superadmin/superadmins/create-superadmin-service.js";

export async function postSuperadminController(
  req: Request<unknown, unknown, PostSuperadminBody>,
  res: Response<BodyResponse<PostSuperadminResponse>>,
) {
  const parsed = PostSuperadminBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ResponseError("Datos inválidos", 400, "BAD_REQUEST");
  }

  const data = await createSuperadminService(parsed.data, req.jwtClaims!);
  return res.status(201).json({ data });
}
