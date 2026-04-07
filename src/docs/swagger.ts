import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, "openapi.yaml"));

export const swaggerDocs = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .auth-wrapper { display: none }",
    swaggerOptions: { supportedSubmitMethods: [] },
  }),
] as const;
