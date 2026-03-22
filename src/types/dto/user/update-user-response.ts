import { UserData } from "../../models/user.js";

export type UpdateSelfResponse = Pick<UserData, "name" | "email">;
