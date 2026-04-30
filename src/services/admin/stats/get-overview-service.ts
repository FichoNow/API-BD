import {
  getRangeStats, getActiveAbsencesCount, getPendingRequestsCount,
  getPunctualityRate, getUserCounts,
} from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { OverviewResponse } from "../../../types/dto/admin/get-stats-response.js";
import { assertDepartmentAccess, localDate, parsePeriod } from "./stats-helpers.js";

export async function getOverviewService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<OverviewResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range, prev, periodLabel, groupBy } = parsePeriod(month, year)
  const today = localDate(new Date())

  const [
    daily, prevDaily,
    activeAbsences, pendingRequests,
    punctuality, prevPunctuality,
    userCounts,
  ] = await Promise.all([
    getRangeStats(departmentId, range.start, range.end, groupBy, undefined, groupId),
    getRangeStats(departmentId, prev.start,  prev.end,  groupBy, undefined, groupId),
    getActiveAbsencesCount(departmentId, today, undefined, groupId),
    getPendingRequestsCount(departmentId, undefined, groupId),
    getPunctualityRate(departmentId, range.start, range.end, undefined, groupId),
    getPunctualityRate(departmentId, prev.start,  prev.end,  undefined, groupId),
    getUserCounts(departmentId, groupId),
  ])

  const fmtDate = (label: unknown) => {
    if (label instanceof Date) return localDate(label)
    return String(label).split("T")[0]
  }
  const parsedDaily = daily.map((d) => ({
    weekday:          groupBy === "weekday" ? Number(d.day_label) : new Date(fmtDate(d.day_label) + "T00:00:00").getDay(),
    date:             groupBy === "date" ? fmtDate(d.day_label) : undefined,
    regular_minutes:  Number(d.regular_minutes),
    overtime_minutes: Number(d.overtime_minutes),
  }))

  const totalMinutes    = parsedDaily.reduce((s, d) => s + d.regular_minutes + d.overtime_minutes, 0)
  const overtimeMinutes = parsedDaily.reduce((s, d) => s + d.overtime_minutes, 0)
  const prevTotal       = prevDaily.reduce((s, d) => s + Number(d.regular_minutes) + Number(d.overtime_minutes), 0)
  const prevOT          = prevDaily.reduce((s, d) => s + Number(d.overtime_minutes), 0)

  return {
    period_label:          periodLabel,
    total_minutes:         totalMinutes,
    overtime_minutes:      overtimeMinutes,
    punctuality_rate:      Number(punctuality),
    active_absences:       Number(activeAbsences),
    pending_requests:      Number(pendingRequests),
    employees_active:      Number(userCounts.active),
    employees_total:       Number(userCounts.total),
    daily:                 parsedDaily,
    total_minutes_prev:    prevTotal,
    overtime_minutes_prev: prevOT,
    punctuality_rate_prev: Number(prevPunctuality),
  }
}
