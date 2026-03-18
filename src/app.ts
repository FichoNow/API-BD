import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorHandler } from "./api/middleware/error-handler.js";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(errorHandler);
