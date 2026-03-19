# Auth Endpoints

## POST /auth/login

Autentica a un usuario y devuelve los tokens de acceso junto con sus datos básicos.

**Reglas de negocio**
- El usuario debe existir y tener `is_active = true`.
- La empresa del usuario debe existir y tener `is_active = true`.
- La contraseña debe coincidir.
- Todos los casos anteriores devuelven el mismo `401` intencionadamente (no se da pistas sobre qué falló).

**Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Respuestas**

`200 OK`

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "userData": {
      "name": "string",
      "role": "USER" | "ADMINISTRATOR",
      "companyName": "string"
    }
  }
}
```

`400 Bad Request` — body vacío, email o password ausentes

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cuerpo de la solicitud inválido"
  }
}
```

`401 Unauthorized` — credenciales incorrectas, usuario inactivo o empresa inactiva

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Credenciales incorrectas"
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
