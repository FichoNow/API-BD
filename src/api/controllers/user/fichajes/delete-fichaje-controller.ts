import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteFichajeService } from "../../../../services/user/fichajes/delete-fichaje-service.js";

export async function deleteFichajeController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await deleteFichajeService(fichajeId, userId);

  res.status(200).json({ data: null });
}
