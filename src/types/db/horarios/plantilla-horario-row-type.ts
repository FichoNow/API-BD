import { RowDataPacket } from "mysql2";
import { PlantillaHorarioData } from "../../models/horarios/plantilla-horario.js";

/** Representa una fila de la tabla `plantillas_horario` tal como la devuelve la base de datos. */
export interface PlantillaHorarioRow extends RowDataPacket, PlantillaHorarioData {}
