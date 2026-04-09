export interface AsignacionUsuarioData {
  id: number;
  user_id: number;
  template_id: number;
  start_date: string;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
}
