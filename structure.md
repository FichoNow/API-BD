# API-BD

## Tecnologías

- **Node.js + TypeScript** — runtime y lenguaje.
- **Express** — framework HTTP. Las rutas, middlewares y controllers viven aquí.
- **MySQL2** — cliente de base de datos. Se usa un pool de conexiones compartido.
- **Zod** — validación de variables de entorno y de los bodies de entrada (DTOs).
- **JWT (jsonwebtoken)** — autenticación. Se emite un accessToken (15 min) y un refreshToken (7 días).
- **bcrypt** — hash de contraseñas.
- **Vitest + Supertest** — tests de integración E2E contra la API real (requiere MySQL corriendo).
- **OpenAPI / Swagger** — documentación de la API en `src/docs/openapi.yaml`.

---

## Estructura

```
src/
├── api/
│   ├── controllers/        ← reciben la request, validan params/query, llaman al service
│   ├── middleware/
│   │   ├── auth-middleware.ts       ← verifica el JWT y adjunta claims al request
│   │   ├── role-middleware.ts       ← comprueba que el rol del token tenga permiso
│   │   └── error-middleware.ts      ← captura errores y los convierte en respuesta JSON
│   └── routes/             ← definen qué URL llama a qué controller
├── services/               ← lógica de negocio (aquí vive lo importante)
├── database/
│   ├── pool.ts             ← conexión compartida a MySQL
│   └── repositories/       ← hacen las queries SQL, devuelven tipos tipados
├── types/
│   ├── models/             ← cómo es un objeto en la app (UserData, ProjectData…)
│   ├── dto/                ← cómo entran y salen los datos por la API (request/response)
│   ├── db/                 ← cómo son las filas que devuelve MySQL (RowDataPacket)
│   └── express/            ← extensiones propias de Express (jwtClaims en Request, ResponseError…)
├── helpers/                ← utilidades pequeñas reutilizables
├── docs/
│   ├── openapi.yaml        ← especificación OpenAPI 3.0 de todos los endpoints
│   └── swagger.ts          ← monta Swagger UI en /api-docs
├── __tests__/
│   └── endpoints.test.ts   ← tests E2E: flujo completo register → login → CRUD → logout
├── config-env.ts           ← valida que todas las variables de entorno estén presentes
├── app.ts                  ← configura Express: registra rutas y middlewares
└── server.ts               ← arranca el servidor en el puerto definido en .env
```

---

## Flujo de una petición

```
Cliente → route → middleware (auth + role) → controller → service → repository → MySQL
                                                       ↑
                                              error-middleware captura cualquier throw
```
