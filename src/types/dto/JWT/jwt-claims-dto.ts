import { UserRole } from "../../db/user-row-type.js";

/** Datos del usuario que se meten dentro del JWT. */
export interface JwtClaims {
  /** ID del usuario en la base de datos. */
  id: number;
  /** ID de la empresa a la que pertenece. */
  companyId: number;
  /** ID del grupo al que pertenece. */
  groupId: number;
  /** Rol del usuario en la empresa. */
  role: UserRole;
}
