import { Request, Response } from "express";
import {
  PostFichajeBody,
  PostFichajeBodySchema,
} from "../../../types/dto/user/post-fichaje-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../types/express/response-type.js";
import { createFichajeService } from "../../../services/user/create-fichaje-service.js";
import { PostFichajeResponse } from "../../../types/dto/user/post-fichaje-response.js";

export async function postFichajeController(
  req: Request<unknown, unknown, PostFichajeBody>,
  res: Response<BodyResponse<PostFichajeResponse>>,
) {
  const parsed = PostFichajeBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  const data = await createFichajeService(parsed.data, userId);

  res.status(201).json({ data });
}
