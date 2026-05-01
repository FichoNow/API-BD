import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { PostDepartmentBody, PostDepartmentBodySchema } from "../../../../types/dto/superadmin/department/post-department-body.js";
import { PostDepartmentResponse } from "../../../../types/dto/superadmin/department/post-department-response.js";
import { createDepartmentService } from "../../../../services/superadmin/department/create-department-service.js";

export async function postDepartmentController(
  req: Request<unknown, unknown, PostDepartmentBody>,
  res: Response<BodyResponse<PostDepartmentResponse>>,
) {
  const parsed = PostDepartmentBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ResponseError("Nombre inválido", 400, "BAD_REQUEST");
  }

  const data = await createDepartmentService(parsed.data.name.trim(), req.jwtClaims!);
  return res.status(201).json({ data });
}
