import { RowDataPacket } from "mysql2";
import { DepartmentData } from "../models/department.js";

/** Representa una fila de la tabla `departments` tal como la devuelve la base de datos. */
export interface DepartmentRow extends RowDataPacket, DepartmentData {}

/** Campos necesarios para insertar un nuevo departamento en la tabla `departments`. Solo incluye los que el service proporciona — `is_active`, `created_at` y `updated_at` los pone el repositorio. */
export type CreateDepartmentRow = Pick<DepartmentData, "company_id" | "name">;
