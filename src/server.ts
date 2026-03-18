import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config-env.js";

// Arranque del servidor :D
app.listen(env.API_PORT, () => {
  console.log(`Servidor escuchando en http:localhost:${env.API_PORT}`);
});
