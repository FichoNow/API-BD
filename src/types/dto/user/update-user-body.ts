import * as z from "zod";
import { createZodObject } from "../../../helpers/zod-helper.js";
import { UserData } from "../../models/user.js";

type UpdateSelfBodyRow = Partial<Pick<UserData, "email" | "name">> & {
  password?: string;
};

export type UpdateSelfBody = UpdateSelfBodyRow;

export const UpdateSelfBodySchema = createZodObject<UpdateSelfBodyRow>({
  email: z.email().trim().toLowerCase().optional(),
  name: z.string().trim().optional(),
  password: z.string().optional(),
}).refine((body) => Object.values(body).some((v) => v !== undefined), {
  message: "El cuerpo de la solicitud no puede estar vacío.",
});
