/** Forma pura de los datos de un proyecto, sin index signature de RowDataPacket. */
export interface ProjectData {
  id: number;
  company_id: number;
  group_id: number | null;
  name: string;
  is_active: boolean;
  created_at: Date;
}
