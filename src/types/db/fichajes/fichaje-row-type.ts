import { RowDataPacket } from "mysql2";
import { FichajeData } from "../../models/fichajes/fichaje.js";

/** Representa una fila de la tabla `fichajes` tal como la devuelve la base de datos. */
export interface FichajeRow extends RowDataPacket, FichajeData {}

/** Campos necesarios para insertar un nuevo fichaje en la tabla `fichajes`. */
export type CreateFichajeRow = Pick<FichajeData, "user_id" | "clock_in">;

/** Update para registrar la salida del fichaje. */
export type UpdateClockOutFichajeRow = Pick<FichajeData, "clock_out">;

/** Update para corregir la hora de entrada. Siempre establece clock_in_modified a true. */
export type UpdateClockInFichajeRow = Pick<FichajeData, "clock_in" | "clock_in_modified">;

/** Update para corregir la hora de salida. Siempre establece clock_out_modified a true. */
export type UpdateClockOutModifiedFichajeRow = Pick<FichajeData, "clock_out" | "clock_out_modified">;
