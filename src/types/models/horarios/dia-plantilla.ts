export interface DiaPlantillaData {
  id: number;
  template_id: number;
  weekday: number; // 1=Lunes ... 7=Domingo
  is_working_day: boolean;
  start_time: string | null;
  end_time: string | null;
  break_minutes: number;
  created_at: Date;
  updated_at: Date;
}
