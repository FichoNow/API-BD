export interface OverviewDepartment {
  id: number;
  name: string;
}

export interface GetOverviewResponse {
  company: {
    id: number;
    name: string;
  };
  departments: OverviewDepartment[];
}
