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

export interface GetStatsResponse {
  period_label: string
  total_minutes: number
  overtime_minutes: number
  punctuality_rate: number
  active_absences: number
  pending_requests: number
  employees_active: number
  employees_total: number
  daily: DayStats[]
  top_employees?: EmployeeRank[]
  hourly_distribution: { hour: number; count: number }[]
  absences_breakdown: { reason: string; count: number }[]
  insights: string[]
}
