export interface PlantillaHorarioData {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  weekly_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
