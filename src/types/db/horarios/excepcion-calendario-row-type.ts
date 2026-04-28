import { RowDataPacket } from "mysql2";
import { ExcepcionCalendarioData } from "../../models/horarios/excepcion-calendario.js";

/** Representa una fila de la tabla `excepciones_calendario` tal como la devuelve la base de datos. */
export interface ExcepcionCalendarioRow extends RowDataPacket, ExcepcionCalendarioData {}

/**
 * Datos necesarios para crear una excepción de calendario.
 *
 * Se usa, por ejemplo, cuando un admin aprueba una solicitud de ausencia
 * y esa solicitud debe reflejarse en el calendario real.
 */
export interface CreateExcepcionCalendarioRow {
  department_id: number;
  user_id: number | null;
  group_id: number | null;
  tipo_id: number;
  leave_request_id: number | null;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_by: number;
}