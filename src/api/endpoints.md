# Endpoints

## POST /auth/login

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
  "accessToken": "string",
  "refreshToken": "string",
  "userData": {
    "name": "string",
    "role": "USER" | "ADMINISTRATOR"
  }
}
```

`400 Bad Request` — body vacío o campos inválidos
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cuerpo de la solicitud inválido"
  }
}
```

`401 Unauthorized` — credenciales incorrectas o usuario inactivo
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Credenciales incorrectas"
  }
}
```

`500 Internal Server Error` — error inesperado
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Ha ocurrido un error inesperado"
  }
}
```
