import { Request, Response } from "express";
import { BodyResponse } from "../../../types/express/response-type.js";
import { getProjectsService } from "../../../services/user/get-projects-service.js";
import { GetProjectsResponse } from "../../../types/dto/user/get-projects-response.js";

export async function getProjectsController(
    req: Request,
    res: Response<BodyResponse<GetProjectsResponse>>,
) {
    const { group_id, company_id } = req.jwtClaims!;

    const data = await getProjectsService(group_id, company_id);

    res.status(200).json({ data });
}
