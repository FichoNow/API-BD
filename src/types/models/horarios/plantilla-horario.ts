export interface PlantillaHorarioData {
  id: number;
  department_id: number;
  name: string;
  description: string | null;
  weekly_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
