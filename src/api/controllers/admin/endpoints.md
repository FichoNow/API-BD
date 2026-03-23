# Admin Endpoints

> Todos los endpoints de este grupo requieren autenticación con un access token válido y rol `ADMINISTRATOR`.

## POST /admin/user

Crea un nuevo usuario con rol `USER` o `ADMINISTRATOR`.

**Reglas de negocio**

- El administrador debe estar autenticado con rol `ADMINISTRATOR`.
- El usuario se crea automáticamente en la empresa (`company_id`) a la que pertenece el administrador autenticado — no se puede especificar otra empresa.
- El `group_id` debe pertenecer a esa misma empresa.
- El email no puede estar ya registrado en el sistema.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body** _(todos los campos requeridos)_

```json
{
  "group_id": "number",
  "email": "string EMAIL válido",
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
    "message": "Cuerpo de la solicitud inválido"
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

`404 Not Found` — el group_id no existe o no pertenece a la empresa del administrador

```json
{
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Grupo no encontrado."
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

---

## PATCH /admin/user/:id

Actualiza los datos de un usuario con rol `USER`.

**Reglas de negocio**

- El administrador debe estar autenticado con rol `ADMINISTRATOR`.
- El usuario a editar debe pertenecer a la misma empresa que el administrador.
- No se puede editar a un usuario con rol `ADMINISTRATOR`.
- Los dos casos anteriores devuelven el mismo `404` intencionadamente (no se da pistas sobre si el usuario existe).
- Si se envía un nuevo email, no puede estar ya registrado por otro usuario.
- Al menos un campo debe estar presente en el body.
- La nueva contraseña no se compara con la anterior — se sobreescribe directamente.

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

`400 Bad Request` — ID inválido, body vacío o sin campos reconocidos

```json
{
  "error": {
    "code": "INVALID_USER_ID" | "BAD_REQUEST" | "NO_FIELDS_TO_UPDATE",
    "message": "No hay campos para actualizar."
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

`409 Conflict` — el email ya está registrado por otro usuario

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Ya existe un usuario con ese email."
  }
}
```
