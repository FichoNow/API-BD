import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { getFichajeEntriesService } from "../../../../../services/user/fichajes/entries/get-fichaje-entries-service.js";
import { GetFichajeEntriesResponse } from "../../../../../types/dto/user/fichajes/entries/get-fichaje-entries-response.js";

/**
 * Controller para obtener todas las entries (registros de proyecto) de un fichaje.
 *
 * Qué hace:
 * 1. Valida que el param `id` sea un entero positivo.
 * 2. Obtiene el id del usuario autenticado desde el JWT.
 * 3. Llama al service para recuperar las entries del fichaje.
 * 4. Devuelve la lista en la respuesta.
 */
export async function getFichajeEntriesController(
    req: Request<{ id: string }>,
    res: Response<BodyResponse<GetFichajeEntriesResponse>>,
) {
    const fichajeId = Number(req.params.id);

    if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
        throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
    }

    const userId = req.jwtClaims!.id;

    const data = await getFichajeEntriesService(fichajeId, userId);

    res.status(200).json({ data });
}
