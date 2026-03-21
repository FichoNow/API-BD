import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorHandler } from "./api/middleware/error-handler.js";
import { usersRouter } from "./api/routes/users-routes.js"; 

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use(usersRouter);

app.use(errorHandler);
