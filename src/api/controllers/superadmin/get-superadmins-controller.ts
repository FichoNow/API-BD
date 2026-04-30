import { Request, Response } from "express";
import { BodyResponse } from "../../../types/express/response-type.js";
import { findSuperadminsByCompanyId } from "../../../database/repositories/user-repository.js";

export async function getSuperadminsController(
  req: Request,
  res: Response<BodyResponse<{ id: number; name: string; email: string; is_active: boolean }[]>>,
) {
  const admins = await findSuperadminsByCompanyId(req.jwtClaims!.company_id)
  return res.status(200).json({ data: admins.map((a) => ({
    id:        Number(a.id),
    name:      String(a.name),
    email:     String(a.email),
    is_active: Boolean(a.is_active),
  })) })
}
