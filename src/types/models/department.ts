/** Forma pura de los datos de un departamento, sin index signature de RowDataPacket. */
export interface DepartmentData {
  id: number;
  company_id: number;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
