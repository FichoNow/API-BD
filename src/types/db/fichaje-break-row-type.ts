import { RowDataPacket } from "mysql2";
import { FichajeBreakData } from "../models/fichaje-break.js";

/** Representa una fila de la tabla "fichaje_breaks" como la devuelve la base de datos. */
export interface FichajeBreakRow extends RowDataPacket, FichajeBreakData {}

/** Campos necesarios para insertar un nuevo break. */
export type CreateFichajeBreakRow = Pick<FichajeBreakData, "fichaje_id" | "started_at">;

/** Campos necesarios para cerrar un break. */
export type UpdateFichajeBreakEndRow = Pick<FichajeBreakData, "ended_at">;
