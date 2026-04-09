export interface ExcepcionCalendarioData {
  id: number;
  company_id: number;
  user_id: number | null;
  group_id: number | null;
  tipo_id: number;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
