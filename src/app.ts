import express from "express";
import { authRouter } from "./api/routes/auth-routes.js";
import { usersRouter } from "./api/routes/users-routes.js"; 
import { errorMiddleware } from "./api/middleware/error-middleware.js";
import { adminRouter } from "./api/routes/admin-routes.js";
import { requireAdministrator } from "./api/middleware/admin-authenticate-middleware.js";
import { userRouter } from "./api/routes/user-routes.js";
import { requireAuth } from "./api/middleware/user-authenticate-middleware.js";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use(usersRouter);

app.use("/admin", requireAdministrator, adminRouter);

app.use("/user", requireAuth, userRouter);

app.use(errorMiddleware);
