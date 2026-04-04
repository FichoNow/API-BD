import { ProjectData } from "../../models/project.js";

/** Lo que devolverá la API cuando obtenga los proyectos visibles para el usuario autenticado. */
export type GetProjectsResponse = Pick<
    ProjectData,
    "id" | "name"
>[];
