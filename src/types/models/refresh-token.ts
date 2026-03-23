/** Forma pura de los datos de un refresh token, sin index signature de RowDataPacket. */
export interface refreshTokenData {
  id: number;

  user_id: number;

  token_hash: string;

  expires_at: Date;

  created_at: Date;
}
