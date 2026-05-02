import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { adminRouter } from "./api/routes/admin-routes.js";
import { requireAdministrator } from "./api/middleware/admin-authenticate-middleware.js";
import { superadminRouter } from "./api/routes/superadmin-routes.js";
import { requireSuperAdmin } from "./api/middleware/superadmin-authenticate-middleware.js";
import { userRouter } from "./api/routes/user-routes.js";
import { requireAuth } from "./api/middleware/user-authenticate-middleware.js";
import { testRouter } from "./api/routes/test-routes.js";
import { swaggerDocs } from "./docs/swagger.js";
import { env } from "./config-env.js";

export const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "100kb" }));

app.use("/api-docs", ...swaggerDocs);

app.use("/auth", authRouter);

app.use("/admin", requireAdministrator, adminRouter);

app.use("/superadmin", requireSuperAdmin, superadminRouter);

app.use("/user", requireAuth, userRouter);

if (env.NODE_ENV === "development") {
  app.use("/test", testRouter);
}

app.use(errorMiddleware);
