import { getTopDays } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { TopDaysResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod, fmtDayLabel } from "./stats-helpers.js";

export async function getTopDaysService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
  userId?: number,
): Promise<TopDaysResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const rows = await getTopDays(departmentId, range.start, range.end, userId, groupId)
  return { days: rows.map((d) => ({ ...d, day_label: fmtDayLabel(d.date) })) }
}
