import { UserData } from "../../models/user.js";

/** Datos del usuario que se meten dentro del JWT. */
export type JwtClaims = Pick<UserData, "id" | "department_id" | "group_id" | "role"> & { company_id: number };
