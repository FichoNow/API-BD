import { RowDataPacket } from "mysql2";
import { FichajeEntryData } from "../models/fichaje-entry.js";

/** Representa una fila de la tabla "fichaje_entries" como la devuelve la base de datos. */
export interface FichajeEntryRow extends RowDataPacket, FichajeEntryData {}

/** Campos necesarios para insertar una nueva entry en la tabla "fichaje_entries". */
export type CreateFichajeEntryRow = Pick<
  FichajeEntryData,
  "fichaje_id" | "project_id" | "started_at"
>;

/** Campos necesarios para cerrar una entry (poner su hora de fin). */
export type UpdateFichajeEntryEndRow = Pick<FichajeEntryData, "ended_at">;

/** Campos necesarios para corregir la hora de inicio de una entry. */
export type UpdateFichajeEntryStartRow = Pick<FichajeEntryData, "started_at">;