import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { adminRouter } from "./api/routes/admin-routes.js";
import { requireAdministrator } from "./api/middleware/admin-authenticate-middleware.js";
import { userRouter } from "./api/routes/user-routes.js";
import { requireAuth } from "./api/middleware/user-authenticate-middleware.js";
import swaggerUi from "swagger-ui-express"; //Documentación de la API
import YAML from "yamljs"; //Documentación de la API
import { fileURLToPath } from "url"; //Documentación de la API
import { dirname, join } from "path"; //Documentación de la API

const __dirname = dirname(fileURLToPath(import.meta.url)); //Documentación de la API
const swaggerDocument = YAML.load(join(__dirname, "docs/openapi.yaml")); //Documentación de la API

export const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "100kb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //Documentación de la API

app.use("/auth", authRouter);

app.use("/admin", requireAdministrator, adminRouter);

app.use("/user", requireAuth, userRouter);

app.use(errorMiddleware);
