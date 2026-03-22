import { UserRow } from "../../../db/user-row-type.js";

export type UpdateSelfBody = Partial<
  Pick<
    UserRow,
    | "email"
    | "name"
    | "password"
  >
>;
