import { UserRole } from "../../../db/user-row-type.js";

/** Lo que devuelve la API al hacer login correctamente. */
export interface PostLoginResponse {
  /** Token de acceso JWT (corta duración). */
  accessToken: string;
  /** Token para renovar el accessToken (larga duración). */
  refreshToken: string;
  /** Datos básicos del usuario para que el cliente los use. */
  userData: {
    name: string;
    role: UserRole;
  };
}
