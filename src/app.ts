import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(errorMiddleware);
