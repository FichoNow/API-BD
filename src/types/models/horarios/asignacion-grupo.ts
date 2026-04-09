export interface AsignacionGrupoData {
  id: number;
  group_id: number;
  template_id: number;
  start_date: string;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
}
