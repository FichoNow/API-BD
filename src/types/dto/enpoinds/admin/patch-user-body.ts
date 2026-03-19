import { UserRole } from "../../../db/user-row-type.js";

export interface UpdateUserBody {
  company_id?: number;
  group_id?: number;
  email?: string;
  name?: string;
  role?: UserRole;
  job_title?: string;
  password?: string;
  is_active?: boolean | number;
}
