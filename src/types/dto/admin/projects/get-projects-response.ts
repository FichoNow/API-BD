import { ProjectData } from "../../../models/project.js";

/** Lo que devuelve la API al listar proyectos de un departamento. */
export type GetProjectsResponse = Array<
  Pick<ProjectData, "id" | "department_id" | "group_id" | "name" | "is_active" | "created_at">
>;
