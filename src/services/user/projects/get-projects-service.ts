import { findProjectsByGroupId } from "../../../database/repositories/project-repository.js";
import { GetProjectsResponse } from "../../../types/dto/user/projects/get-projects-response.js";

/**
 * Lógica de negocio para obtener los proyectos visibles para el usuario autenticado.
 * Devuelve los proyectos cuyo group_id coincide con el del usuario o es NULL (proyectos globales).
 * @param groupId ID del grupo del usuario autenticado.
 * @param companyId ID de la empresa del usuario autenticado.
 * @returns Lista de proyectos visibles.
 */
export async function getProjectsService(
    groupId: number | null,
    departmentId: number,
): Promise<GetProjectsResponse> {
    const projects = await findProjectsByGroupId(groupId, departmentId);

    return projects.map((project) => ({
        id: project.id,
        name: project.name,
    }));
}
