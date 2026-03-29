import { findGroupById } from "../../database/repositories/work-group-repository.js";
import {
  findProjectById,
  findProjectByNameAndCompany,
  updateProjectById,
} from "../../database/repositories/project-repository.js";
import { PatchProjectBody } from "../../types/dto/admin/patch-project-body.js";
import { PatchProjectResponse } from "../../types/dto/admin/patch-project-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para actualizar un proyecto existente.
 * Verifica que el proyecto exista y pertenezca a la empresa, valida el grupo si se cambia,
 * comprueba que el nombre no esté en uso y persiste los cambios.
 * @param projectId ID del proyecto a actualizar.
 * @param body Campos a actualizar.
 * @param companyId ID de la empresa del administrador autenticado (extraído del JWT).
 * @returns Los datos actualizados del proyecto.
 */
export async function updateProjectService(
  projectId: number,
  body: PatchProjectBody,
  companyId: number,
): Promise<PatchProjectResponse> {
  const project = await findProjectById(projectId);

  if (!project || project.company_id !== companyId) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  if (body.group_id) {
    const group = await findGroupById(body.group_id);

    if (!group || group.company_id !== companyId) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
  }

  if (body.name) {
    const existing = await findProjectByNameAndCompany(body.name, companyId);

    if (existing && existing.id !== projectId) {
      throw new ResponseError(
        "Ya existe un proyecto con ese nombre.",
        409,
        "PROJECT_ALREADY_EXISTS",
      );
    }
  }

  const updated = await updateProjectById(projectId, {
    group_id: body.group_id,
    name: body.name,
    is_active: body.is_active,
  });

  if (!updated) {
    throw new ResponseError("Error al actualizar el proyecto.", 500, "UPDATE_FAILED");
  }

  const updatedProject = await findProjectById(projectId);

  if (!updatedProject) {
    throw new ResponseError("Error al obtener el proyecto actualizado.", 500, "PROJECT_NOT_FOUND");
  }

  return {
    id: updatedProject.id,
    company_id: updatedProject.company_id,
    group_id: updatedProject.group_id,
    name: updatedProject.name,
    is_active: updatedProject.is_active,
  };
}
