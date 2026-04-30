import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteUserService } from "../../../../services/admin/users/delete-user-service.js";

export async function deleteUserController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<{ id: number }>>,
) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ResponseError("ID de usuario no válido", 400, "INVALID_USER_ID");
  }

  const data = await deleteUserService(userId, req.jwtClaims!);
  return res.status(200).json({ data });
}
