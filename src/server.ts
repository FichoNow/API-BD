import { app } from "./app.js";
import { env } from "./config-env.js";

app.listen(env.API_PORT, () => {
  console.log(`Servidor escuchando en http:localhost:${env.API_PORT}`);
});
