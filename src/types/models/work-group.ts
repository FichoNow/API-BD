/** Forma pura de los datos de un grupo de trabajo, sin index signature de RowDataPacket. */
export interface WorkGroupData {
  id: number;
  name: string;
  company_id: number;
  primary_user_id: number | null;
}
