import express, { Request, Response } from "express";

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Ruta GET simple
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API funcionando 🚀",
  });
});

app.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
