import { RowDataPacket } from "mysql2";
import { DiaPlantillaData } from "../../models/horarios/dia-plantilla.js";

/** Representa una fila de la tabla `dias_plantilla` tal como la devuelve la base de datos. */
export interface DiaPlantillaRow extends RowDataPacket, DiaPlantillaData {}
