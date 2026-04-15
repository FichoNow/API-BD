import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { getProjectsService } from "../../../../services/user/projects/get-projects-service.js";
import { GetProjectsResponse } from "../../../../types/dto/user/projects/get-projects-response.js";

/**
 * Controller para obtener los proyectos disponibles para el usuario autenticado.
 * Devuelve los proyectos de la empresa que son accesibles para el grupo del usuario.
 *
 * Qué hace:
 * 1. Obtiene el `group_id` y `company_id` del usuario desde el JWT.
 * 2. Llama al service para recuperar la lista de proyectos.
 * 3. Devuelve la lista en la respuesta.
 */
export async function getProjectsController(
    req: Request,
    res: Response<BodyResponse<GetProjectsResponse>>,
) {
    const { group_id, company_id } = req.jwtClaims!;

    const data = await getProjectsService(group_id, company_id);

    res.status(200).json({ data });
}
