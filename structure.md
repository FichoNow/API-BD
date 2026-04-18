# API-BD

```
src/
├── api/
│   ├── controllers/        ← reciben la request, validan el body, llaman al service
│   │   ├── auth/
│   │   ├── admin/
│   │   └── user/
│   ├── middleware/         ← se ejecutan antes de los controllers (autenticación, errores)
│   └── routes/             ← definen qué URL llama a qué controller
├── services/               ← lógica de negocio (aquí vive lo importante)
│   ├── auth/
│   ├── admin/
│   └── user/
├── database/
│   ├── pool.ts             ← conexión a la base de datos
│   └── repositories/       ← hacen las queries SQL, devuelven datos
├── types/
│   ├── models/             ← cómo es un objeto en la app (UserData, ProjectData...)
│   ├── dto/                ← cómo entran y salen los datos por la API (request/response)
│   ├── db/                 ← cómo son las filas que devuelve la base de datos
│   └── express/            ← extensiones propias de Express (Request, Response)
├── helpers/                ← utilidades pequeñas reutilizables
├── config-env.ts           ← valida que las variables de entorno estén bien
├── app.ts                  ← configura Express (rutas, middlewares)
└── server.ts               ← arranca el servidor
```
