export interface DayStats {
  weekday: number
  date?: string
  regular_minutes: number
  overtime_minutes: number
}

export interface EmployeeRank {
  id: number
  name: string
  regular_minutes: number
  overtime_minutes: number
  total_minutes: number
  punctuality_rate: number
}

export interface WorkGroup {
  id: number
  name: string
}

export interface BreaksStats {
  total_break_minutes: number
  fichajes_with_break: number
  total_fichajes: number
  avg_break_minutes: number
}

export interface OvertimeYearlyEntry {
  user_id: number
  user_name: string
  overtime_minutes: number
  legal_limit_minutes: number
  pct_of_limit: number
}

export interface ActiveNowEntry {
  id: number
  name: string
  clock_in: string
}

export interface ProjectHourEntry {
  project_name: string
  minutes: number
}

export interface TopDayEntry {
  date: string
  day_label: string
  total_minutes: number
}

export interface HourlyBucket {
  hour: number
  count: number
}

export interface AbsenceReason {
  reason: string
  count: number
}

// ── Endpoint responses ──

export interface OverviewResponse {
  period_label: string
  total_minutes: number
  overtime_minutes: number
  punctuality_rate: number
  active_absences: number
  pending_requests: number
  employees_active: number
  employees_total: number
  daily: DayStats[]
  total_minutes_prev: number
  overtime_minutes_prev: number
  punctuality_rate_prev: number
}

export interface RankingResponse {
  employees: EmployeeRank[]
}

export interface ProjectsPeriodResponse {
  projects: ProjectHourEntry[]
}

export interface ActiveNowResponse {
  active: ActiveNowEntry[]
}

export interface HourlyResponse {
  distribution: HourlyBucket[]
}

export interface AbsencesResponse {
  reasons: AbsenceReason[]
}

export interface TopDaysResponse {
  days: TopDayEntry[]
}

export interface BreaksResponse extends BreaksStats {}

export interface OvertimeYearlyResponse {
  entries: OvertimeYearlyEntry[]
}

export interface GroupsResponse {
  groups: WorkGroup[]
}

export interface UserProjectRow {
  user_id: number
  user_name: string
  project_name: string
  minutes: number
}
export interface UserProjectHoursResponse {
  rows: UserProjectRow[]
}

// ── User composite (vista individual + comparador) ──

export interface UserStatsResponse {
  period_label: string
  total_minutes: number
  overtime_minutes: number
  punctuality_rate: number
  active_absences: number
  pending_requests: number
  daily: DayStats[]
  total_minutes_prev: number
  overtime_minutes_prev: number
  punctuality_rate_prev: number
  project_hours: ProjectHourEntry[]
  top_days: TopDayEntry[]
  breaks: BreaksStats
  overtime_yearly: OvertimeYearlyEntry[]
}

// ── Compatibilidad con endpoints existentes ──

export interface GetProjectStatsResponse {
  project_name: string
  total_minutes: number
  period_label: string
  users: { user_id: number; user_name: string; minutes: number }[]
}

export interface ProjectOverview {
  project_name: string
  minutes: number
  user_count: number
}

export interface GetProjectsOverviewResponse {
  projects: ProjectOverview[]
  total_minutes: number
  total_projects: number
}
