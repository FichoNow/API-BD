import { RowDataPacket } from "mysql2";
import { AsignacionGrupoData } from "../../models/horarios/asignacion-grupo.js";

/** Representa una fila de la tabla `asignaciones_grupo` tal como la devuelve la base de datos. */
export interface AsignacionGrupoRow extends RowDataPacket, AsignacionGrupoData {}
