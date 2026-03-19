import { CompanyRow } from "../../../db/company-row-type.js";
import { UserRow } from "../../../db/user-row-type.js";

/** Lo que devuelve la API al hacer login correctamente. */
export interface PostLoginResponse {
  /** Token de acceso JWT (corta duración). */
  accessToken: string;
  /** Token para renovar el accessToken (larga duración). */
  refreshToken: string;
  /** Datos básicos del usuario para usarlos en androidStudio. */
  userData: Pick<UserRow, "name" | "role"> & {
    companyName: Pick<CompanyRow, "name">["name"];
  };
}
