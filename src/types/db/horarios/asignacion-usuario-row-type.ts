import { RowDataPacket } from "mysql2";
import { AsignacionUsuarioData } from "../../models/horarios/asignacion-usuario.js";

/** Representa una fila de la tabla `asignaciones_usuario` tal como la devuelve la base de datos. */
export interface AsignacionUsuarioRow extends RowDataPacket, AsignacionUsuarioData {}
