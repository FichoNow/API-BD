# Admin Endpoints

## POST /admin/user

Crea un nuevo usuario con rol `USER` o `ADMINISTRATOR`.

**Reglas de negocio**

- El administrador debe estar autenticado con rol `ADMINISTRATOR`.
- El email no puede estar ya registrado en el sistema.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body** _(todos los campos requeridos)_

```json
{
  "group_id": "number",
  "email": "string EMAIL valido",
  "name": "string",
  "role": "USER" | "ADMINISTRATOR",
  "job_title": "string",
  "password": "string",
  "is_active": "boolean"
}
```

**Respuestas**

`201 Created`

```json
{
  "data": {
    "id": "number",
    "company_id": "number",
    "group_id": "number",
    "email": "string",
    "name": "string",
    "role": "USER" | "ADMINISTRATOR",
    "job_title": "string",
    "is_active": "boolean"
  }
}
```

`400 Bad Request` — body inválido o campos faltantes

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "El cuerpo de la solicitud es invalido"
  }
}
```

`409 Conflict` — el email ya está registrado

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Ya existe un usuario con ese email."
  }
}
```

`401 Unauthorized` — token ausente o inválido
Lanzado por el middleware de autenticación, antes de llegar al controller.

```json
{
  "error": {
    "code": "MISSING_AUTH_HEADER" | "INVALID_AUTH_HEADER" | "TOKEN_EXPIRED" | "TOKEN_INVALID",
    "message": "El token ha expirado"
  }
}
```

`403 Forbidden` — el token es válido pero el usuario no tiene rol ADMINISTRATOR

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "No autorizado"
  }
}
```

---

## PATCH /admin/user/:id

Actualiza los datos de un usuario con rol `USER`.

**Reglas de negocio**

- El administrador debe estar autenticado con rol `ADMINISTRATOR`.
- El usuario a editar debe pertenecer a la misma empresa que el administrador.
- No se puede editar a un usuario con rol `ADMINISTRATOR`.
- Los dos casos anteriores devuelven el mismo `404` intencionadamente (no se da pistas sobre si el usuario existe).

**Headers**

```
Authorization: Bearer <accessToken>
```

**Params**

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| `id`      | number | ID del usuario a editar |

**Body** _(al menos un campo requerido)_

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "USER" | "ADMINISTRATOR",
  "job_title": "string",
  "group_id": "number",
  "is_active": "boolean"
}
```

**Respuestas**

`200 OK`

```json
{
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "USER" | "ADMINISTRATOR",
    "job_title": "string",
    "group_id": "number",
    "is_active": "boolean",
    "updated_at": "string"
  }
}
```

`400 Bad Request` — ID inválido o body vacío

```json
{
  "error": {
    "code": "INVALID_USER_ID" | "BAD_REQUEST",
    "message": "El ID del usuario no es válido"
  }
}
```

`401 Unauthorized` — token ausente o inválido
Lanzado por el middleware de autenticación, antes de llegar al controller.

```json
{
  "error": {
    "code": "MISSING_AUTH_HEADER" | "INVALID_AUTH_HEADER" | "TOKEN_EXPIRED" | "TOKEN_INVALID",
    "message": "El token ha expirado"
  }
}
```

`403 Forbidden` — el token es válido pero el usuario no tiene rol ADMINISTRATOR

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "No autorizado"
  }
}
```

`404 Not Found` — usuario no encontrado, pertenece a otra empresa o tiene rol ADMINISTRATOR

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuario no encontrado"
  }
}
```
