# PRO-CONNECT

Aplicacion web full-stack para conectar clientes con profesionales, gestionar reservas y dar seguimiento al proceso de contratacion de punta a punta.

## Guia para equipo (local)

Para el trabajo del equipo en entorno local, seguir:

- docs/GUIA_EQUIPO_LOCAL_INSTALACION_PRUEBAS_Y_BACKLOG.md

## Flujo recomendado para el equipo (solo local)

Usen este flujo en desarrollo para no depender de deploy:

1. Instalar dependencias:

```bash
npm run setup:local
```

2. Levantar base local:

```bash
npm run db:up
```

3. Crear archivos `.env` desde ejemplos:

- Copiar `pro-connect/backend/.env.example` a `pro-connect/backend/.env`
- Copiar `pro-connect/frontend/.env.example` a `pro-connect/frontend/.env`

4. Ejecutar todo el proyecto:

```bash
yarn start:dev
```

Notas:

- `yarn start:dev` levanta backend y frontend juntos en paralelo.
- No es necesario configurar Render ni Vercel para trabajar en local.

## Enlaces de produccion

- Frontend: https://frontend-ten-taupe-36.vercel.app
- Backend: https://proconnect-backend-6sox.onrender.com
- Healthcheck: https://proconnect-backend-6sox.onrender.com/api/health

## Funcionalidades principales

- Registro e inicio de sesion para cliente y profesional.
- Publicacion y administracion de servicios.
- Busqueda de profesionales por especialidad.
- Creacion y gestion de reservas.
- Negociacion de ofertas y contraofertas.
- Chat en tiempo real por reserva.
- Notificaciones en la plataforma.
- Facturacion y calificaciones.

## Stack

- Frontend: React, Vite, TypeScript.
- Backend: NestJS, TypeORM, PostgreSQL.
- Tiempo real: Socket.IO.
- Deploy: Vercel (frontend) y Render (backend).

## Estructura del repositorio

```text
pro-connect/
  backend/
  frontend/
  docker-compose.yml
```

## Ejecucion local

1. Levantar base local:

```bash
npm run db:up
```

2. Instalar dependencias:

```bash
npm run setup:local
```

3. Ejecutar servicios:

```bash
yarn start:dev
```

Notas:

- `yarn start:dev` levanta backend y frontend juntos en paralelo.
- Alternativa equivalente con npm: `npm run start:dev`.
- Para apagar Postgres local: `npm run db:down`.

## Variables de entorno

- Frontend: VITE_API_URL
- Backend: DATABASE_URL, FRONTEND_URL, DB_SSL, DB_SYNCHRONIZE, DB_LOGGING

Ejemplos disponibles en:

- pro-connect/frontend/.env.example
- pro-connect/backend/.env.example

## Autor

Edwin Andres Sanchez



