import { RowDataPacket } from "mysql2";
import { WorkGroupData } from "../models/work-group.js";

/** Representa una fila de la tabla `work_groups` tal como la devuelve la base de datos. */
export interface WorkGroupRow extends RowDataPacket, WorkGroupData {}
