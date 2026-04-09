import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { buildCalendarMonthService } from "../../../../services/user/calendar/build-calendar-month-service.js";
import { GetCalendarMonthResponse } from "../../../../types/dto/user/calendar/get-calendar-month-response.js";

export async function getMonthCalendarController(
  req: Request,
  res: Response<BodyResponse<GetCalendarMonthResponse>>,
) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!Number.isInteger(year) || year <= 0) {
    throw new ResponseError("Año inválido.", 400, "BAD_REQUEST");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new ResponseError("Mes inválido.", 400, "BAD_REQUEST");
  }

  const data = await buildCalendarMonthService(req.jwtClaims!, year, month);

  res.status(200).json({ data });
}
