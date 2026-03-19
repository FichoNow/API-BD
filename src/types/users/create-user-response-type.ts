export interface CreateUserResponseType {
    message: string;
    user: {
        id: number;
        company_id: number;
        group_id: number;
        email: string;
        name: string;
        role: "USER" | "ADMINISTRATOR";
        job_title: string;
        is_active: number;
    }
}