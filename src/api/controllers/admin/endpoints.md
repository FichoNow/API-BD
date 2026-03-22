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
