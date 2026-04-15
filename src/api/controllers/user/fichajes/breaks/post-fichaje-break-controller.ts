import { Request, Response } from "express";
import {
  PostFichajeBreakBody,
  PostFichajeBreakBodySchema,
} from "../../../../../types/dto/user/fichajes/breaks/post-fichaje-break-body.js";
import { PostFichajeBreakResponse } from "../../../../../types/dto/user/fichajes/breaks/post-fichaje-break-response.js";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { createFichajeBreakService } from "../../../../../services/user/fichajes/breaks/create-fichaje-break-service.js";

/**
 * Controller para iniciar un descanso dentro de un fichaje activo.
 *
 * Qué hace:
 * 1. Valida que el param `id` (fichaje) sea un entero positivo.
 * 2. Valida el body con el schema de Zod.
 * 3. Llama al service para crear el descanso y obtiene el id generado.
 * 4. Devuelve el id del nuevo descanso con status 201.
 */
export async function postFichajeBreakController(
  req: Request<{ id: string }, unknown, PostFichajeBreakBody>,
  res: Response<BodyResponse<PostFichajeBreakResponse>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PostFichajeBreakBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  const data = await createFichajeBreakService(fichajeId, parsed.data, userId);

  res.status(201).json({ data });
}
