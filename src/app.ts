import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { adminRouter } from "./api/routes/admin-routes.js";
import { requireAdministrator } from "./api/middleware/admin-authenticate-middleware.js";
import { userRouter } from "./api/routes/user-routes.js";
import { requireAuth } from "./api/middleware/user-authenticate-middleware.js";
import { swaggerDocs } from "./docs/swagger.js";

export const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "100kb" }));

app.use("/api-docs", ...swaggerDocs);

app.use("/auth", authRouter);

app.use("/admin", requireAdministrator, adminRouter);

app.use("/user", requireAuth, userRouter);

app.use(errorMiddleware);
