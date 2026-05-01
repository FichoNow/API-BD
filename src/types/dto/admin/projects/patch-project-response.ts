import { ProjectData } from "../../../models/project.js";

/** Lo que devuelve la API al actualizar un proyecto correctamente. */
export type PatchProjectResponse = Pick<
  ProjectData,
  | "id"
  | "department_id"
  | "group_id"
  | "name"
  | "is_active"
>;
