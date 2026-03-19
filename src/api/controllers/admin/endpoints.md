# Admin Endpoints

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
|-----------|--------|-------------------------|
| `id`      | number | ID del usuario a editar |

**Body** *(al menos un campo requerido)*

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
  "success": true,
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
  "success": false,
  "error": {
    "code": "INVALID_USER_ID" | "BAD_REQUEST",
    "message": "string"
  }
}
```

`401 Unauthorized` — token ausente o inválido

```json
{
  "success": false,
  "error": {
    "code": "MISSING_AUTH_HEADER" | "INVALID_AUTH_HEADER" | "TOKEN_EXPIRED" | "TOKEN_INVALID",
    "message": "string"
  }
}
```

`403 Forbidden` — el token es válido pero el usuario no tiene rol ADMINISTRATOR

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No autorizado"
  }
}
```

`404 Not Found` — usuario no encontrado, pertenece a otra empresa o tiene rol ADMINISTRATOR

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuario no encontrado"
  }
}
```

`500 Internal Server Error` — error inesperado del servidor

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Ha ocurrido un error inesperado"
  }
}
```
