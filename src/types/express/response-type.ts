/**
 * Estructura genérica de respuesta de la API.
 *
 * Todas las respuestas, tanto de éxito como de error, siguen este formato.
 * En caso de éxito, `success` es `true` y `data` contiene el resultado.
 * En caso de error, `success` es `false` y `error` contiene el código y mensaje.
 */
export interface BodyResponse<T = null> {
  success: boolean;
  data: T;
  error?: Pick<ResponseError, "code" | "message">;
}

/**
 * Error personalizado para lanzar errores controlados en la app.
 * *
 * Extiende Error añadiendo un código HTTP y un código de error identificable.
 * Se usa en controllers, services y middlewares para devolver respuestas de error claras.
 */
export class ResponseError extends Error {
  public statusCode: number;
  public code: string;

  /**
   * @param message - Mensaje descriptivo del error.
   * @param statusCode - Código HTTP de la respuesta (por defecto 500).
   * @param code - Código identificador del error, ej: "UNAUTHORIZED" (por defecto "INTERNAL_ERROR").
   */
  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
