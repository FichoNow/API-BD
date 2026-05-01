import { getDepartmentGroups } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GroupsResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess } from "./stats-helpers.js";

export async function getGroupsService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GroupsResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const groups = await getDepartmentGroups(departmentId)
  return { groups }
}
