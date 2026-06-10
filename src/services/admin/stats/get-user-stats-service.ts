import { findUsersByDepartmentId } from "../../../database/repositories/user-repository.js";
import {
  getRangeStats, getActiveAbsencesCount, getPendingRequestsCount,
  getPunctualityRate, getProjectHours, getTopDays,
  getBreaksStats, getOvertimeYearly,
} from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { UserStatsResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { ResponseError } from "../../../types/express/response-type.js";
import {
  assertDepartmentAccess, localDate, parsePeriod, fmtDayLabel,
  LEGAL_OVERTIME_LIMIT_MINUTES,
} from "./stats-helpers.js";

export async function getUserStatsService(
  departmentId: number,
  userId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
): Promise<UserStatsResponse> {
  await assertDepartmentAccess(departmentId, claims)

  const users = await findUsersByDepartmentId(departmentId)
  if (!users.some((u) => u.id === userId))
    throw new ResponseError("El usuario no pertenece a este departamento", 404, "USER_NOT_FOUND")

  const { range, prev, periodLabel, groupBy } = parsePeriod(month, year)
  const today = localDate(new Date())
  const currentYear = new Date().getFullYear()

  const [
    daily, prevDaily,
    activeAbsences, pendingRequests,
    punctuality, prevPunctuality,
    projectHours, topDaysRaw,
    breaks, overtimeYearlyRaw,
  ] = await Promise.all([
    getRangeStats(departmentId, range.start, range.end, groupBy, userId),
    getRangeStats(departmentId, prev.start,  prev.end,  groupBy, userId),
    getActiveAbsencesCount(departmentId, today, userId),
    getPendingRequestsCount(departmentId, userId),
    getPunctualityRate(departmentId, range.start, range.end, userId),
    getPunctualityRate(departmentId, prev.start,  prev.end,  userId),
    getProjectHours(departmentId, range.start, range.end, userId),
    getTopDays(departmentId, range.start, range.end, userId),
    getBreaksStats(departmentId, range.start, range.end, userId),
    getOvertimeYearly(departmentId, currentYear, userId),
  ])

  const fmtDate = (label: unknown): string => {
    if (label instanceof Date) return localDate(label)
    return String(label).split("T")[0]
  }
  const parsedDaily = daily.map((d) => ({
    weekday:          groupBy === "weekday" ? Number(d.day_label) : new Date(fmtDate(d.day_label) + "T00:00:00").getDay(),
    date:             groupBy === "date" ? fmtDate(d.day_label) : undefined,
    regular_minutes:  Number(d.regular_minutes),
    overtime_minutes: Number(d.overtime_minutes),
    edited_count:     Number(d.edited_count),
  }))

  const totalMinutes    = parsedDaily.reduce((s,d) => s + d.regular_minutes + d.overtime_minutes, 0)
  const overtimeMinutes = parsedDaily.reduce((s,d) => s + d.overtime_minutes, 0)
  const editedFichajes  = parsedDaily.reduce((s,d) => s + d.edited_count, 0)
  const prevTotal       = prevDaily.reduce((s,d) => s + Number(d.regular_minutes) + Number(d.overtime_minutes), 0)
  const prevOT          = prevDaily.reduce((s,d) => s + Number(d.overtime_minutes), 0)

  const overtimeYearly = overtimeYearlyRaw.map((o) => ({
    ...o,
    legal_limit_minutes: LEGAL_OVERTIME_LIMIT_MINUTES,
    pct_of_limit:        Math.round((o.overtime_minutes / LEGAL_OVERTIME_LIMIT_MINUTES) * 100),
  }))

  return {
    period_label:          periodLabel,
    total_minutes:         totalMinutes,
    overtime_minutes:      overtimeMinutes,
    punctuality_rate:      Number(punctuality),
    active_absences:       Number(activeAbsences),
    pending_requests:      Number(pendingRequests),
    edited_fichajes:       editedFichajes,
    daily:                 parsedDaily,
    total_minutes_prev:    prevTotal,
    overtime_minutes_prev: prevOT,
    punctuality_rate_prev: Number(prevPunctuality),
    project_hours:         projectHours,
    top_days:              topDaysRaw.map((d) => ({ ...d, day_label: fmtDayLabel(d.date) })),
    breaks,
    overtime_yearly:       overtimeYearly,
  }
}
