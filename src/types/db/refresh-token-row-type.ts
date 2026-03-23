import { RowDataPacket } from "mysql2";
import { refreshTokenData } from "../models/refresh-token.js";

/** Representa una fila de la tabla `refresh_tokens` tal como la devuelve la base de datos. */
export interface RefreshTokenRow extends RowDataPacket, refreshTokenData {}

/** Campos necesarios para insertar un nuevo refresh token en la tabla `refresh_tokens`. */
export type CreateRefreshTokenRow = Pick<
  refreshTokenData,
  "user_id" | "token_hash" | "expires_at"
>;
