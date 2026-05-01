import { ProjectData } from "../../../models/project.js";

/** Lo que devuelve la API al crear un proyecto correctamente. */
export type CreateProjectResponse = Pick<
  ProjectData,
  "id" | "department_id" | "group_id" | "name" | "is_active"
>;
