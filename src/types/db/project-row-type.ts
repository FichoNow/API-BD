import { RowDataPacket } from "mysql2";
import { ProjectData } from "../models/project.js";

/** Representa una fila de la tabla `projects` tal como la devuelve la base de datos. */
export interface ProjectRow extends RowDataPacket, ProjectData {}

/** Campos necesarios para insertar un nuevo proyecto en la tabla `projects`. */
export type CreateProjectRow = Pick<
  ProjectData,
  "department_id" | "group_id" | "name" | "is_active"
>;

/** Campos actualizables de la tabla `projects`. Usado por el repository al hacer UPDATE. */
export type UpdateProjectRow = Partial<
  Pick<ProjectData, "group_id" | "name" | "is_active">
>;
