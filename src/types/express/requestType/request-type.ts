import { JwtClaims } from "../../dto/JWT/jwt-claims-dto.js";

// El middleware de autenticación lo rellena; las rutas privadas lo usan para saber quién hace la petición.
declare global {
  namespace Express {
    interface Request {
      /** Datos del usuario extraídos del JWT. Solo existe si la ruta pasa por el middleware de autenticación. */
      jwtClaims?: JwtClaims;
    }
  }
}

export {};
