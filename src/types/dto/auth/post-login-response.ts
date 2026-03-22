import { CompanyData } from "../../models/company.js";
import { UserData } from "../../models/user.js";

/** Lo que devuelve la API al hacer login correctamente. */
export interface PostLoginResponse {
  accessToken: string;
  refreshToken: string;
  userData: Pick<UserData, "name" | "role" | "email"> & {
    companyName: CompanyData["name"];
  };
}
