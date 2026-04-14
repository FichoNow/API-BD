import { Request, Response } from "express";
import {
    PostLeaveRequestBody,
    PostLeaveRequestBodySchema,
} from "../../../../types/dto/user/requests/post-leave-request-body.js";
import {
    BodyResponse,
    ResponseError,
} from "../../../../types/express/response-type.js";
import { createLeaveRequestService } from "../../../../services/user/requests/create-leave-request-service.js";
import { PostLeaveRequestResponse } from "../../../../types/dto/user/requests/post-leave-request-response.js";

/**
 * Controller para crear una solicitud del usuario autenticado.
 *
 * Qué hace:
 * 1. Valida el body con Zod.
 * 2. Obtiene el id del usuario desde el JWT.
 * 3. Llama al service para aplicar la lógica de negocio.
 * 4. Devuelve la respuesta con status 201.
 */
export async function postLeaveRequestController(
    req: Request<Record<string, never>, unknown, PostLeaveRequestBody>,
    res: Response<BodyResponse<PostLeaveRequestResponse>>,
) {
    // Validamos la forma del body.
    const parsed = PostLeaveRequestBodySchema.safeParse(req.body);

    // Si el body no es válido, devolvemos un error 400.
    if (!parsed.success) {
        throw new ResponseError(
            "Cuerpo de la solicitud inválido.",
            400,
            "BAD_REQUEST",
        );
    }

    // Sacamos el id del usuario autenticado desde el JWT.
    const userId = req.jwtClaims!.id;

    // Llamamos al service, que se encarga de la lógica de negocio real.
    const data = await createLeaveRequestService(
        parsed.data,
        userId,
    );

    // Devolvemos la respuesta con el id creado.
    res.status(201).json({ data });
}