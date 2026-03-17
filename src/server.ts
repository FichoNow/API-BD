import "dotenv/config";
import { app } from "./app.js";

// Arranque del servidor :D
app.listen(process.env.API_PORT, () => {
  console.log(`Servidor escuchando en http:localhost:${process.env.API_PORT}`);
});
