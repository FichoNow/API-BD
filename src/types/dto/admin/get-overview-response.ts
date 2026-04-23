export interface CompanyInfoDepartment {
  id: number;
  name: string;
}

export interface GetCompanyInfoResponse {
  company: {
    id: number;
    name: string;
  };
  departments: CompanyInfoDepartment[];
}
