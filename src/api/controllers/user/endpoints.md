# User Endpoints

> Todos los endpoints de este grupo requieren autenticación con un access token válido.

## PATCH /user/update

Actualiza los datos del propio perfil del usuario autenticado.

**Reglas de negocio**

- El usuario debe estar autenticado (token válido).
- Al menos un campo debe estar presente en el body.
- Si se envía un nuevo email, no puede estar ya registrado por otro usuario.
- La nueva contraseña no se compara con la anterior — se sobreescribe directamente.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body** _(al menos un campo requerido)_

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Respuestas**

`200 OK`

```json
{
  "data": {
    "name": "string",
    "email": "string"
  }
}
```

`400 Bad Request` — body vacío o sin campos reconocidos

```json
{
  "error": {
    "code": "BAD_REQUEST" | "NO_FIELDS_TO_UPDATE",
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

`404 Not Found` — usuario no encontrado

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

---

## DELETE /user/logout

Cierra la sesión del usuario eliminando su refresh token de la base de datos.

**Reglas de negocio**

- El usuario debe estar autenticado (token válido).
- Si el refresh token no existe (ya fue eliminado o nunca fue válido), se responde igualmente con `200` — no se expone información sobre el estado del token.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{
  "refreshToken": "string"
}
```

**Respuestas**

`200 OK`

```json
{
  "data": null
}
```

`400 Bad Request` — body vacío o refreshToken ausente

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
