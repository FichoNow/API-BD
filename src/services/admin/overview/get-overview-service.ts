import { findCompanyById } from "../../../database/repositories/company-repository.js";
import { findDepartmentById, findDepartmentsByCompanyId } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetCompanyInfoResponse } from "../../../types/dto/admin/overview/get-overview-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function getCompanyInfoService(claims: JwtClaims): Promise<GetCompanyInfoResponse> {
  const company = await findCompanyById(claims.company_id);

  if (!company) {
    throw new ResponseError("Empresa no encontrada", 404, "COMPANY_NOT_FOUND");
  }

  if (claims.role === "SUPERADMIN") {
    const departments = await findDepartmentsByCompanyId(claims.company_id);
    return {
      company: { id: company.id, name: company.name },
      departments: departments.map((d) => ({ id: d.id, name: d.name })),
    };
  }

  const department = await findDepartmentById(claims.department_id);

  if (!department) {
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND");
  }

  return {
    company: { id: company.id, name: company.name },
    departments: [{ id: department.id, name: department.name }],
  };
}
