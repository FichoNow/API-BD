import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),

  DATABASE_HOST: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive(),

  API_PORT: z.coerce.number().int().positive(),

  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().int().positive(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Error en variables de entorno:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
