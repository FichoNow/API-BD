// Importamos Express
import express from "express";
// Importamos el router de autenticacion.
import { authRouter } from "./api/routes/auth-routes.js";
// Creamos la aplicación principal de Express.
export const app = express();
// Un log para comprobar que app.ts se carga.
console.log("DEBUG: app.ts cargado");
// Middleware para que Express pueda leer JSON en las peticiones.
app.use(express.json());

// Log para confirmar que el router se ha montado.
console.log("DEBUG: authRouter montado en app.ts");
// Exportamos la app para arrancarla desde "server.ts".
