# Auth Endpoints

## POST /auth/login

Autentica a un usuario y devuelve los tokens de acceso junto con sus datos básicos.

**Reglas de negocio**

- El usuario debe existir y tener `is_active = true`.
- La empresa del usuario debe existir y tener `is_active = true`.
- La contraseña debe coincidir.
- Todos los casos anteriores devuelven el mismo `401` intencionadamente (no se da pistas sobre qué falló).
- Limitado a **10 intentos por IP cada 15 minutos** para prevenir fuerza bruta.

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
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "userData": {
      "name": "string",
      "role": "USER" | "ADMINISTRATOR",
      "email": "string",
      "companyName": "string"
    }
  }
}
```

`400 Bad Request` — body vacío, email o password ausentes, email con formato inválido

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cuerpo de la solicitud inválido"
  }
}
```

`401 Unauthorized` — credenciales incorrectas, usuario inactivo o empresa inactiva

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Credenciales incorrectas"
  }
}
```

`429 Too Many Requests` — demasiados intentos desde la misma IP

```json
{
  "message": "Demasiados intentos. Inténtalo de nuevo en 15 minutos."
}
```

---

## POST /auth/refresh

Emite un nuevo access token a partir de un refresh token válido.

**Reglas de negocio**

- El refresh token debe existir en la base de datos y no haber expirado.
- El usuario asociado al token debe existir y tener `is_active = true`.
- La empresa del usuario debe existir y tener `is_active = true`.
- El refresh token **no se invalida** al usarlo — puede generar múltiples access tokens mientras viva.

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
  "data": {
    "accessToken": "string"
  }
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

`401 Unauthorized` — token no encontrado, expirado, usuario inactivo o empresa inactiva

```json
{
  "error": {
    "code": "UNAUTHORIZED" | "TOKEN_EXPIRED",
    "message": "Token inválido"
  }
}
```
