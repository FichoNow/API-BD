# User Endpoints

## PATCH /user/update

Actualiza los datos del propio perfil del usuario autenticado.

**Reglas de negocio**

- El usuario debe estar autenticado (token válido).
- El body no puede estar vacío (al menos un campo requerido).

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

`400 Bad Request` — body vacío

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "El cuerpo de la solicitud no puede estar vacío"
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
