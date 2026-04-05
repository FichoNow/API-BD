import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { getFichajeBreaksService } from "../../../../services/user/fichaje-breaks/get-fichaje-breaks-service.js";
import { GetFichajeBreaksResponse } from "../../../../types/dto/user/fichaje-breaks/get-fichaje-breaks-response.js";

export async function getFichajeBreaksController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<GetFichajeBreaksResponse>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  const data = await getFichajeBreaksService(fichajeId, userId);

  res.status(200).json({ data });
}
