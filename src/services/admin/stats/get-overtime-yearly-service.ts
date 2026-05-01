import { getOvertimeYearly } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { OvertimeYearlyResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, LEGAL_OVERTIME_LIMIT_MINUTES } from "./stats-helpers.js";

export async function getOvertimeYearlyService(
  departmentId: number,
  claims: JwtClaims,
  groupId?: number,
  userId?: number,
  year?: number,
): Promise<OvertimeYearlyResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const targetYear = year ?? new Date().getFullYear()
  const raw = await getOvertimeYearly(departmentId, targetYear, userId, groupId)
  return {
    entries: raw.map((o) => ({
      ...o,
      legal_limit_minutes: LEGAL_OVERTIME_LIMIT_MINUTES,
      pct_of_limit:        Math.round((o.overtime_minutes / LEGAL_OVERTIME_LIMIT_MINUTES) * 100),
    })),
  }
}
