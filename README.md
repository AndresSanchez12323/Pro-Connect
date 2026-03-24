# PRO-CONNECT

Plataforma web full-stack para conectar clientes con profesionales y ejecutar el ciclo completo de contratacion digital: busqueda, reserva, negociacion, chat en tiempo real, notificaciones, facturacion y reputacion.

![Estado](https://img.shields.io/badge/Estado-Produccion-success?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)
![Database](https://img.shields.io/badge/Database-Neon-00E599?style=flat-square&logo=postgresql&logoColor=black)

## Enlaces de produccion

- Frontend (Vercel): https://frontend-ten-taupe-36.vercel.app
- Backend (Render): https://proconnect-backend-6sox.onrender.com
- Healthcheck API: https://proconnect-backend-6sox.onrender.com/api/health

## Estado actual

- Proyecto desplegado y accesible en produccion.
- Base de datos en Neon configurada para uso real.
- Este entorno puede estar en uso actualmente; no se publican credenciales de prueba en este repositorio.

## Autor

> Proyecto disenado, construido y desplegado por **Edwin Andres Sanchez**.

![Hecho por Edwin Andres Sanchez](https://img.shields.io/badge/Hecho%20por-Edwin%20Andres%20Sanchez-111827?style=for-the-badge)

## Que se puede hacer en la plataforma

- Registro e inicio de sesion para perfiles de cliente y profesional.
- Administrar perfil personal y datos de cuenta.
- Crear y administrar perfil profesional con especialidad y experiencia.
- Publicar servicios con precio y modalidad (online o presencial).
- Buscar profesionales y servicios por criterios de necesidad.
- Crear reservas y gestionar su ciclo de vida (pendiente, confirmada, cancelada, completada).
- Negociar condiciones y precio dentro de una reserva.
- Chatear en tiempo real por reserva con persistencia de mensajes.
- Recibir notificaciones sobre eventos del flujo de contratacion.
- Generar y consultar facturacion de reservas completadas.
- Registrar reseñas y reputacion entre usuarios y profesionales.

## Proyecto completo

PRO-CONNECT es un sistema full-stack orientado a conectar oferta y demanda de servicios profesionales en un flujo unico, desde el descubrimiento hasta el cierre de la contratacion.

Flujo funcional principal:

1. Un usuario se registra como cliente o profesional.
2. El profesional publica servicios y disponibilidad.
3. El cliente busca, selecciona y crea una reserva.
4. Ambas partes pueden negociar y confirmar condiciones.
5. El sistema habilita chat, notificaciones y seguimiento de estado.
6. Al finalizar, se registra facturacion y retroalimentacion.

Arquitectura del proyecto:

- Frontend SPA en React + Vite para experiencia de usuario.
- Backend API en NestJS para reglas de negocio y endpoints.
- Socket.IO para mensajeria en tiempo real.
- Persistencia relacional en PostgreSQL (Neon en produccion).
- Despliegue distribuido: Vercel (frontend) y Render (backend).

Modulos funcionales principales:

- Autenticacion y perfil de usuario.
- Gestion de profesionales y servicios.
- Reservas y negociacion.
- Chat y notificaciones.
- Facturacion y reputacion.

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

Infraestructura:

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat-square&logo=postgresql&logoColor=black)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)

## Estructura del repositorio

```text
pro-connect/
  backend/          # API NestJS + TypeORM
  frontend/         # App React + Vite
  docker-compose.yml
```

## Ejecucion local

1. Levantar base local:

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

## Variables de entorno

- Frontend: `VITE_API_URL`
- Backend: `DATABASE_URL`, `FRONTEND_URL`, `DB_SSL`, `DB_SYNCHRONIZE`, `DB_LOGGING`

Revisar ejemplos en:

- `pro-connect/frontend/.env.example`
- `pro-connect/backend/.env.example`

## Seguridad

- No almacenar ni compartir credenciales reales en el repositorio.
- Si una cadena de conexion se expone, rotar password y actualizar `DATABASE_URL` en Render.



