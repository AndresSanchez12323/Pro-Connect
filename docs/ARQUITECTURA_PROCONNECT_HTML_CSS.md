# Arquitectura ProConnect HTML/CSS

## Enfoque del producto

ProConnect queda enfocado como plataforma para contratar profesionales que ofrecen servicios de HTML y CSS. La aplicacion conserva dos roles:

- USER: cliente que explora profesionales, solicita contratos, firma y conversa cuando el contrato fue aceptado.
- PROFESSIONAL: profesional que administra su perfil, publica servicios HTML/CSS, revisa contratos, solicita cambios, acepta/rechaza y firma.

## Backend NestJS

La estructura base correcta esta en `pro-connect/backend/src/modules`:

- `auth`: registro, login y sesion JWT.
- `users`: perfil base del usuario.
- `professionals`: perfil profesional HTML/CSS y busqueda publica.
- `services`: servicios publicados por profesionales.
- `contracts`: solicitudes de contrato, cambios, aceptacion, firma y cancelacion.
- `chat`: conversaciones asociadas a contratos aceptados o firmados.
- `notifications`: notificaciones internas por contrato y chat.
- `dashboard`: resumen de inicio para cliente y profesional.

Cada modulo debe mantener esta separacion:

- `*.controller.ts`: endpoints HTTP.
- `*.service.ts`: reglas de negocio.
- `dto/`: validacion de datos de entrada.
- `entities/`: modelos TypeORM.
- `*.module.ts`: declaracion y dependencias del modulo.

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/professionals`
- `GET /api/professionals/search`
- `GET /api/professionals/:profileId`
- `GET /api/professionals/:profileId/services`
- `GET /api/services?professionalId=...`
- `GET /api/services/mine`
- `POST /api/services`
- `PATCH /api/services/:serviceId`
- `DELETE /api/services/:serviceId`
- `GET /api/contracts`
- `POST /api/contracts`
- `PATCH /api/contracts/:contractId/respond`
- `PATCH /api/contracts/:contractId/sign`
- `GET /api/chat/mine`
- `GET /api/chat/:contractId`
- `POST /api/chat/message`
- `GET /api/notifications/mine`
- `PATCH /api/notifications/:notificationId/read`
- `GET /api/dashboard/client/summary`
- `GET /api/dashboard/professional/summary`

`/api/reservations` queda como compatibilidad temporal para pantallas antiguas, pero el dominio final debe usar `contracts`.

## Frontend React

La estructura actual principal esta en `pro-connect/frontend/src`:

- `pages/auth`: login, registro y recuperacion.
- `pages/dashboard/client`: vistas del cliente.
- `pages/dashboard/professional`: vistas del profesional.
- `pages/dashboard/shared`: vistas compartidas.
- `components/chat`: centro de mensajes.
- `components/layout`: navegacion y layout.
- `components/professional`: exploracion de servicios.
- `lib/api.ts`: cliente HTTP.
- `lib/session.ts`: sesion local.

Regla importante: el frontend no debe importar dependencias de servidor como NestJS, TypeORM o PostgreSQL.

## Flujo objetivo

1. El profesional se registra como `PROFESSIONAL`.
2. El backend crea su `ProfessionalProfile` con especialidad HTML/CSS.
3. El profesional publica servicios con titulo, descripcion, precio y dias estimados.
4. El cliente explora profesionales y servicios.
5. El cliente solicita contrato con fecha, precio y terminos.
6. El profesional acepta, rechaza o solicita cambios.
7. Cuando se acepta, ambas partes pueden firmar.
8. El chat se habilita solo cuando el contrato esta aceptado o firmado.
9. Las notificaciones informan cambios de contrato, firmas y mensajes.

## Pendientes recomendados

- Migrar visualmente todas las pantallas que aun dicen "reservas" para que digan "contratos".
- Crear modulo real de feed/red social con publicaciones, comentarios y conexiones.
- Implementar facturacion, reputacion y reviews o retirar esas pantallas hasta que existan.
- Agregar migraciones TypeORM en vez de depender de `synchronize: true`.
- Agregar pruebas e2e para registro, publicacion de servicio, contrato, firma y chat.
