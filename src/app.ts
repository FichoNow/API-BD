import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";

export const app = express();

console.log("DEBUG: app.ts cargado");

app.use(express.json());

app.use("/auth", authRouter);

console.log("DEBUG: authRouter montado en app.ts");
