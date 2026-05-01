import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import {
  findProjectById,
  findProjectByNameAndDepartment,
  updateProjectById,
} from "../../../database/repositories/project-repository.js";
import { PatchProjectBody } from "../../../types/dto/admin/projects/patch-project-body.js";
import { PatchProjectResponse } from "../../../types/dto/admin/projects/patch-project-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function updateProjectService(
  projectId: number,
  body: PatchProjectBody,
  claims: JwtClaims,
): Promise<PatchProjectResponse> {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  const department = await findDepartmentById(project.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  if (body.group_id) {
    const group = await findGroupById(body.group_id);

    if (!group || group.department_id !== project.department_id) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
  }

  if (body.name) {
    const existing = await findProjectByNameAndDepartment(body.name, project.department_id);

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
    department_id: updatedProject.department_id,
    group_id: updatedProject.group_id,
    name: updatedProject.name,
    is_active: updatedProject.is_active,
  };
}
