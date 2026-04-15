import { Request, Response } from "express";
import {
  PostFichajeBody,
  PostFichajeBodySchema,
} from "../../../../types/dto/user/fichajes/post-fichaje-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { createFichajeService } from "../../../../services/user/fichajes/create-fichaje-service.js";
import { PostFichajeResponse } from "../../../../types/dto/user/fichajes/post-fichaje-response.js";

/**
 * Controller para crear un nuevo fichaje (registrar entrada).
 * Se llama cuando el usuario pulsa "fichar" desde la app.
 *
 * Qué hace:
 * 1. Valida el body con el schema de Zod.
 * 2. Obtiene el id del usuario autenticado desde el JWT.
 * 3. Llama al service para crear el fichaje y obtiene el id generado.
 * 4. Devuelve el id del nuevo fichaje con status 201.
 */
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
