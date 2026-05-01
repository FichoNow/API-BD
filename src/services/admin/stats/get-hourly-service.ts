import { getHourlyDistribution } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { HourlyResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getHourlyService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<HourlyResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const distribution = await getHourlyDistribution(departmentId, range.start, range.end, groupId)
  return { distribution }
}
