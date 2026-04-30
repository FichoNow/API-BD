import { Request, Response } from "express";
import { z } from "zod";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { createDepartmentService } from "../../../services/superadmin/create-department-service.js";

const bodySchema = z.object({
  name: z.string().min(1).max(150),
});

export async function postDepartmentController(
  req: Request,
  res: Response<BodyResponse<{ id: number; name: string }>>,
) {
  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Nombre inválido", 400, "BAD_REQUEST");
  }

  const data = await createDepartmentService(parsed.data.name.trim(), req.jwtClaims!);
  return res.status(201).json({ data });
}
