# PRO-CONNECT

Plataforma web full-stack para conectar clientes con profesionales y ejecutar el ciclo completo de contratacion digital: busqueda, reserva, negociacion, chat en tiempo real, notificaciones, facturacion y reputacion.

![Estado](https://img.shields.io/badge/Estado-Funcional-success?style=flat-square)
![Version](https://img.shields.io/badge/Version-Academica-blue?style=flat-square)
![Licencia](https://img.shields.io/badge/Licencia-Uso%20academico-lightgrey?style=flat-square)

## Tabla de contenido

- [Resumen](#resumen)
- [Tech Stack](#tech-stack)
- [Tecnologias usadas](#tecnologias-usadas)
- [Como funciona](#como-funciona)
- [Modulos funcionales](#modulos-funcionales)
- [Credenciales demo](#credenciales-demo)
- [Arquitectura y patrones](#arquitectura-y-patrones)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Instalacion local](#instalacion-local)
- [API principal](#api-principal)
- [Seguridad actual](#seguridad-actual)
- [Roadmap corto](#roadmap-corto)

## Resumen

ProConnect fue construido con enfoque de producto real y separacion de responsabilidades entre frontend, backend y persistencia.

- Flujo completo para cliente y profesional.
- Persistencia real en PostgreSQL.
- API modular con NestJS y TypeORM.
- Interfaz moderna con React + Vite + TypeScript.

## Tech Stack

Backend:
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-E83524?style=flat-square&logo=typeorm&logoColor=white)

Frontend:
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

Base de datos e infraestructura:
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## Tecnologias usadas

- React + Vite + TypeScript: interfaz SPA, enrutamiento por rol y consumo de API.
- NestJS: arquitectura modular, validacion de DTOs y controladores REST.
- Socket.IO: eventos de mensajeria en tiempo real por reserva.
- TypeORM: modelado de entidades, relaciones y persistencia transaccional.
- PostgreSQL: almacenamiento de usuarios, servicios, reservas, chat, facturas, reseñas y notificaciones.
- Docker Compose: entorno local reproducible para base de datos.

## Como funciona

1. El usuario se registra e inicia sesion como cliente o profesional.
2. El profesional publica uno o varios servicios (precio y modalidad).
3. El cliente busca profesionales y crea una reserva.
4. El backend valida conflictos de horario y crea la contratacion.
5. Ambas partes pueden negociar oferta en la reserva.
6. Se habilita chat en tiempo real asociado a esa reserva.
7. Se generan notificaciones por eventos de negocio (reserva, cambios, mensajes).
8. Al completar la reserva se genera factura.
9. El cliente deja reseña y se actualiza la reputacion del profesional.

## Modulos funcionales

- Gestion de perfiles profesionales y servicios.
- Busqueda de profesionales por especialidad.
- Reservas con reprogramacion, cancelacion y negociacion.
- Chat en tiempo real con historial persistente.
- Notificaciones con estado de lectura.
- Facturacion por reserva completada.
- Reputacion basada en calificaciones reales.
- Recuperacion de contrasena.

## Credenciales demo

Estas credenciales se generan con el seed:

| Rol | Correo | Contrasena |
| --- | --- | --- |
| USER | ana.user@proconnect.dev | ProConnect123! |
| USER | carlos.user@proconnect.dev | ProConnect123! |
| PROFESSIONAL | maria.pro@proconnect.dev | ProConnect123! |
| PROFESSIONAL | juan.pro@proconnect.dev | ProConnect123! |
| PROFESSIONAL | laura.pro@proconnect.dev | ProConnect123! |

## Arquitectura y patrones

- Facade: ProConnectFacade centraliza reglas de negocio.
- Abstract Factory: reservation.factory.ts define comportamiento por modalidad.
- Builder: ReservationBuilder construye reservas paso a paso.
- Observer: DomainEventBus y ProConnectObserver reaccionan a eventos de dominio.

## Estructura del repositorio

```text
pro-connect/
  backend/          # API NestJS + TypeORM
  frontend/         # App React + Vite
  docker-compose.yml
```

## Instalacion local

1. Levantar base de datos:

```bash
cd pro-connect
docker compose up -d
```

2. Instalar dependencias:

```bash
npm --prefix backend install
npm --prefix frontend install
```

3. Ejecutar backend y frontend (desde la raiz del workspace):

```bash
npm run dev:backend
npm run dev:frontend
```

4. Cargar datos de prueba:

```bash
npm run seed
```

5. Montar base completa desde SQL (opcional):

```powershell
./montar_bd.ps1
```

## API principal

Base URL: http://localhost:3002/api

- Auth: /auth/register, /auth/login, /auth/recover/request, /auth/recover/reset, /auth/me
- Dashboard: /dashboard/client/summary, /dashboard/professional/summary
- Profesionales y servicios: /profiles, /services, /professionals/search
- Reservas: /reservations, /reservations/:id/respond, /reservations/:id/reschedule, /reservations/:id/cancel
- Chat: /chat/open, /chat/message, /chat/:reservationId
- Notificaciones: /notifications/mine, /notifications/:notificationId/read
- Facturas: /invoices, /invoices/generate/:reservationId
- Reputacion: /reviews, /reputation/:professionalId

## Seguridad actual

Los endpoints protegidos usan el header x-user-id para control de acceso por usuario en reservas, chat, facturas y notificaciones.

## Roadmap corto

- Migrar autenticacion a JWT con refresh tokens.
- Agregar autorizacion por roles y permisos mas finos.
- Incluir pruebas e2e adicionales de flujos completos.
- Publicar deployment demo con CI/CD.

## Deployment gratis recomendado

Stack recomendado sin costo:

- Frontend: Vercel (Hobby)
- Backend NestJS: Render (Free Web Service)
- PostgreSQL: Neon (Free)

### 1) Backend en Render

1. Conecta tu repo en Render.
2. Usa el archivo blueprint [render.yaml](../render.yaml) o crea el servicio manualmente:
  - Root Directory: `pro-connect/backend`
  - Build Command: `npm ci && npm run build`
  - Start Command: `npm run start:prod`
3. Configura variables de entorno (ver [backend/.env.example](backend/.env.example)):
  - `DATABASE_URL`
  - `DB_SSL=true`
  - `PORT=3002`
  - `FRONTEND_URL=https://tu-frontend.vercel.app`

### 2) Frontend en Vercel

1. Importa el repo en Vercel.
2. Configura el Root Directory en `pro-connect/frontend`.
3. Define variable `VITE_API_URL` con tu URL del backend, por ejemplo:
  - `https://tu-backend.onrender.com/api`
4. Se incluye [frontend/vercel.json](frontend/vercel.json) para soporte SPA (rutas con React Router).

### 3) Base de datos en Neon

1. Crea un proyecto PostgreSQL gratis en Neon.
2. Copia la connection string y pegala en `DATABASE_URL` del backend en Render.
3. En este proyecto TypeORM usa `synchronize=true` por defecto, por lo que creara tablas al iniciar.
