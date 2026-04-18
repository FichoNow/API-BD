import { RowDataPacket } from "mysql2";
import { DepartmentData } from "../models/department.js";

/** Representa una fila de la tabla `departments` tal como la devuelve la base de datos. */
export interface DepartmentRow extends RowDataPacket, DepartmentData {}
