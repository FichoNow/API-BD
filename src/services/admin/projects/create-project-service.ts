import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { CreateProjectBody } from "../../../types/dto/admin/projects/create-project-body.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import {
  createProject,
  findProjectByNameAndDepartment,
} from "../../../database/repositories/project-repository.js";
import { CreateProjectResponse } from "../../../types/dto/admin/projects/create-project-response.js";

export async function createProjectService(
  body: CreateProjectBody,
  claims: JwtClaims,
): Promise<CreateProjectResponse> {
  const department = await findDepartmentById(body.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado.", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (body.group_id) {
    const group = await findGroupById(body.group_id);

    if (!group || group.department_id !== body.department_id) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
  }

  const existing = await findProjectByNameAndDepartment(body.name, body.department_id);

  if (existing) {
    throw new ResponseError(
      "Ya existe un proyecto con ese nombre.",
      409,
      "PROJECT_ALREADY_EXISTS",
    );
  }

  const projectId = await createProject({
    department_id: body.department_id,
    group_id: body.group_id,
    name: body.name,
    is_active: body.is_active,
  });

  return {
    id: projectId,
    department_id: body.department_id,
    group_id: body.group_id,
    name: body.name,
    is_active: body.is_active,
  };
}
