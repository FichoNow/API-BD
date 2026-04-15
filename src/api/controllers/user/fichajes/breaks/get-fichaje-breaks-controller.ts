import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { getFichajeBreaksService } from "../../../../../services/user/fichajes/breaks/get-fichaje-breaks-service.js";
import { GetFichajeBreaksResponse } from "../../../../../types/dto/user/fichajes/breaks/get-fichaje-breaks-response.js";

/**
 * Controller para obtener todos los descansos de un fichaje concreto.
 *
 * Qué hace:
 * 1. Valida que el param `id` sea un entero positivo.
 * 2. Obtiene el id del usuario autenticado desde el JWT.
 * 3. Llama al service para recuperar la lista de descansos.
 * 4. Devuelve la lista en la respuesta.
 */
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
