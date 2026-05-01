import { getEmployeeRanking } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { RankingResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getRankingService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<RankingResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const rows = await getEmployeeRanking(departmentId, range.start, range.end, groupId)
  return {
    employees: rows.map((r) => ({
      id: r.id, name: r.name,
      regular_minutes:  Number(r.regular_minutes),
      overtime_minutes: Number(r.overtime_minutes),
      total_minutes:    Number(r.total_minutes),
      punctuality_rate: r.total_count ? Math.round((r.on_time_count / r.total_count) * 100) : 100,
    })),
  }
}
