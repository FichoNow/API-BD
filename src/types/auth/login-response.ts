import { UserRole } from "../db/db-user-type.js";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userData: {
    name: string;
    role: UserRole;
  };
}
