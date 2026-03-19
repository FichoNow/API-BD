/** Datos que llegan en el body al hacer login. */
export interface PostLoginBody {
  /** Email del usuario. */
  email: string;
  /** Contraseña del usuario. */
  password: string;
}
