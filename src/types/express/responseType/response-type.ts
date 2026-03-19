import { ResponseError } from "./response-error-type.js";

/**
 * Error personalizado para lanzar errores controlados en la app.
 *
 * Extiende Error añadiendo un código HTTP y un código de error identificable.
 * Se usa en controllers, services y middlewares para devolver respuestas de error claras.
 */
export interface BodyResponse<T = null> {
  success: boolean;
  data: T;
  error?: Pick<ResponseError, "code" | "message">;
}
