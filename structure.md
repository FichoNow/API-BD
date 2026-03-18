# Estructura del proyecto

## Carpetas

**`api/`** — Todo lo relacionado con HTTP: rutas, controladores y middleware de errores.

**`services/`** — Lógica de negocio. Los controladores delegan aquí. No sabe nada de HTTP.

**`database/`** — Conexión a MySQL y repositorios. Solo ejecuta queries, sin lógica de negocio.

**`types/`** — Interfaces y tipos TypeScript compartidos entre capas.

**`extras/`** — SQL de creación de la BD y ejemplos de peticiones.

---

## Flujo de una petición

Ejemplo: `POST /auth/login`

1. La petición entra por **`routes`**, que la redirige al controlador correspondiente.
2. El **`controller`** valida el body. Si falta algún campo, lanza un error.
3. Si el body es correcto, llama al **`service`**, que contiene la lógica: buscar el usuario, comprobar contraseña, actualizar el último login...
4. El service usa el **`repository`** para hablar con la base de datos.
5. Si todo va bien, el controller devuelve la respuesta al cliente.
6. Si en cualquier punto se lanza un `AppError`, el **`error-handler`** lo intercepta y devuelve un JSON de error estandarizado.
