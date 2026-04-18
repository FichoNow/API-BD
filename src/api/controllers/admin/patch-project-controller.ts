import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../types/express/response-type.js";
import {
  PatchProjectBody,
  PatchProjectBodySchema,
} from "../../../types/dto/admin/patch-project-body.js";
import { PatchProjectResponse } from "../../../types/dto/admin/patch-project-response.js";
import { updateProjectService } from "../../../services/admin/update-project-service.js";

/**
 * Controller del endpoint de actualización de proyecto (PATCH /admin/project/:id).
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar el ID del proyecto desde los parámetros de la ruta.
 * 3. Extraer los datos a actualizar del body.
 * 4. Delegar la lógica al service `updateProjectService`.
 * 5. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function patchProjectController(
  req: Request<{ id: string }, unknown, PatchProjectBody>,
  res: Response<BodyResponse<PatchProjectResponse>>,
) {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    throw new ResponseError(
      "ID de proyecto no válido",
      400,
      "INVALID_PROJECT_ID",
    );
  }

  const parsed = PatchProjectBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await updateProjectService(projectId, parsed.data as PatchProjectBody, req.jwtClaims!);

  return res.status(200).json({ data });
}
