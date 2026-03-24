/** Lo que devuelve la API al refrescar el access token correctamente. */
export interface PostRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
