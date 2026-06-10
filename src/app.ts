import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { adminRouter } from "./api/routes/admin-routes.js";
import { requireAdministrator } from "./api/middleware/admin-authenticate-middleware.js";
import { superadminRouter } from "./api/routes/superadmin-routes.js";
import { requireSuperAdmin } from "./api/middleware/superadmin-authenticate-middleware.js";
import { userRouter } from "./api/routes/user-routes.js";
import { requireAuth } from "./api/middleware/user-authenticate-middleware.js";
import { swaggerDocs } from "./docs/swagger.js";

export const app = express();

app.disable("x-powered-by");

// Detrás de túnel/proxy: confiar en el primer salto para que X-Forwarded-For
// identifique al cliente real. Sin esto, express-rate-limit lanza
// ERR_ERL_UNEXPECTED_X_FORWARDED_FOR y limitaría por la IP del proxy
// (bloqueando a todos los usuarios a la vez).
app.set("trust proxy", 1);

app.use(express.json({ limit: "100kb" }));

app.use("/api-docs", ...swaggerDocs);

app.use("/auth", authRouter);

app.use("/admin", requireAdministrator, adminRouter);

app.use("/superadmin", requireSuperAdmin, superadminRouter);

app.use("/user", requireAuth, userRouter);

app.use(errorMiddleware);
