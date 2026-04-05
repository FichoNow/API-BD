import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { getFichajesService } from "../../../../services/user/fichajes/get-fichajes-service.js";
import { GetFichajesResponse } from "../../../../types/dto/user/fichajes/get-fichajes-response.js";

export async function getFichajesController(
  req: Request,
  res: Response<BodyResponse<GetFichajesResponse>>,
) {
  const userId = req.jwtClaims!.id;

  const data = await getFichajesService(userId);

  res.status(200).json({ data });
}
