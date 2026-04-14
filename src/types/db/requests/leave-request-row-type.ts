import { RowDataPacket } from "mysql2/promise";

export interface LeaveRequestRow extends RowDataPacket {
    id: number;
    user_id: number;
    type_id: number;
    start_date: Date;
    end_date: Date;
    start_time: string | null;
    end_time: string | null;
    comment: string | null;
    status_id: number;
    reviewed_by: number | null;
    reviewed_at: Date | null;
    review_comment: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateLeaveRequestRow {
    user_id: number;
    type_id: number;
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;
    comment: string | null;
    status_id: number;
}