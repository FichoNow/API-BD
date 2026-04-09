import { RowDataPacket } from "mysql2";
import { TipoExcepcionData } from "../../models/horarios/tipo-excepcion.js";

/** Representa una fila de la tabla `tipos_excepcion` tal como la devuelve la base de datos. */
export interface TipoExcepcionRow extends RowDataPacket, TipoExcepcionData {}
