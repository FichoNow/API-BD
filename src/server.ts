// Importamos la app configurada en app.ts.
import { app } from "./app.js";
// Puerto donde escucha nuestra API.
const PORT = 3000;
// Log para verificar que nuestro server.ts se ejecuta!
console.log("DEBUG: server.ts cargado");
// Arranque del servidor :D
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http:localhost:${PORT}`);
});