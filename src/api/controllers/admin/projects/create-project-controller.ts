import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import {
  CreateProjectBody,
  CreateProjectBodySchema,
} from "../../../../types/dto/admin/create-project-body.js";
import { createProjectService } from "../../../../services/admin/projects/create-project-service.js";
import { CreateProjectResponse } from "../../../../types/dto/admin/create-project-response.js";

/**
 * Controller encargado de gestionar la creación de un proyecto nuevo.
 *
 * Su responsabilidad es:
 * - leer el body de la petición
 * - validar que estén todos los campos obligatorios
 * - llamar al service correspondiente
 * - devolver la respuesta HTTP adecuada
 */
export async function createProjectController(
  req: Request<unknown, unknown, CreateProjectBody>,
  res: Response<BodyResponse<CreateProjectResponse>>,
) {
  const parsed = CreateProjectBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createProjectService(parsed.data as CreateProjectBody, req.jwtClaims!);

  res.status(201).json({ data });
}
