import { RowDataPacket } from "mysql2";

/** Representa una fila de la tabla `work_groups` tal como la devuelve la base de datos. */
export interface WorkGroupRow extends RowDataPacket {
  id: number;
  name: string;
  company_id: number;
  primary_user_id: number | null;
}
