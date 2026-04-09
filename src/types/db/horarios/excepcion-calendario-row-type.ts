import { RowDataPacket } from "mysql2";
import { ExcepcionCalendarioData } from "../../models/horarios/excepcion-calendario.js";

/** Representa una fila de la tabla `excepciones_calendario` tal como la devuelve la base de datos. */
export interface ExcepcionCalendarioRow extends RowDataPacket, ExcepcionCalendarioData {}
