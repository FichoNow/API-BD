import { UserRow } from "../../../db/user-row-type.js";

export type UpdateSelfResponse = Pick<UserRow, "name" | "email">;
