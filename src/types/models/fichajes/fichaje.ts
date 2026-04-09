/** Forma pura de los datos de un fichaje, sin index signature de RowDataPacket. */
export interface FichajeData {
  id: number;
  user_id: number;
  clock_in: Date;
  clock_out: Date | null;
  clock_in_modified: boolean;
  clock_out_modified: boolean;
  created_at: Date;
}
