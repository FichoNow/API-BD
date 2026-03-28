import { findGroupById } from "../../database/repositories/work-group-repository.js";
import { ResponseError } from "../../types/express/response-type.js";
import { CreateProjectBody } from "../../types/dto/admin/create-project-body.js";
import {
  createProject,
  findProjectByNameAndCompany,
} from "../../database/repositories/project-repository.js";
import { CreateProjectResponse } from "../../types/dto/admin/create-project-response.js";

/**
 * Lógica de negocio para crear un proyecto nuevo.
 * Comprueba que el grupo (si se indica) pertenece a la empresa, que no exista
 * ya un proyecto con el mismo nombre en la empresa y crea el proyecto en base de datos.
 * @param body Datos del nuevo proyecto a crear.
 * @param companyId ID de la empresa del administrador autenticado (extraído del JWT).
 * @returns Los datos del proyecto creado.
 */
export async function createProjectService(
  body: CreateProjectBody,
  companyId: number,
): Promise<CreateProjectResponse> {
  if (body.group_id) {
    const group = await findGroupById(body.group_id);

    if (!group || group.company_id !== companyId) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
  }

  const existing = await findProjectByNameAndCompany(body.name, companyId);

  if (existing) {
    throw new ResponseError(
      "Ya existe un proyecto con ese nombre.",
      409,
      "PROJECT_ALREADY_EXISTS",
    );
  }

  const projectId = await createProject({
    company_id: companyId,
    group_id: body.group_id, // null si no viene → SQL lo pone NULL
    name: body.name,
    is_active: body.is_active,
  });

  return {
    id: projectId,
    company_id: companyId,
    group_id: body.group_id,
    name: body.name,
    is_active: body.is_active,
  };
}
