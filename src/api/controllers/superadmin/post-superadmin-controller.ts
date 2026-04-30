import { Request, Response } from "express";
import { z } from "zod";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { createUser, findUserByEmail } from "../../../database/repositories/user-repository.js";
import { hashPassword } from "../../../services/auth/password-hash-service.js";

const bodySchema = z.object({
  name:     z.string().min(1).max(150),
  email:    z.string().email(),
  password: z.string().min(6),
})

export async function postSuperadminController(
  req: Request,
  res: Response<BodyResponse<{ id: number; name: string; email: string }>>,
) {
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ResponseError("Datos inválidos", 400, "BAD_REQUEST")
  }

  const { name, email, password } = parsed.data

  const existing = await findUserByEmail(email)
  if (existing) {
    throw new ResponseError("Ya existe un usuario con ese email", 409, "EMAIL_ALREADY_EXISTS")
  }

  const passwordHash = await hashPassword(password)

  const id = await createUser({
    department_id:        req.jwtClaims!.department_id,
    group_id:             null,
    email,
    name,
    role:                 "SUPERADMIN",
    password_hash:        passwordHash,
    is_active:            true,
    must_change_password: true,
  })

  return res.status(201).json({ data: { id, name, email } })
}
