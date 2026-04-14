import { LeaveRequestData } from "../../../models/requests/leave-request.js";

export type GetLeaveRequestsResponseItem = Pick<
    LeaveRequestData,
    "id" | "type" | "start_date" | "end_date" | "start_time" | "end_time" | "status" | "comment"
>;

export type GetLeaveRequestsResponse = GetLeaveRequestsResponseItem[];
