# PRO-CONNECT - Guia completa de trabajo local para equipo

Esta guia es para que cualquier integrante del equipo pueda:

- instalar todo desde cero en su maquina,
- correr backend, frontend y base de datos en local,
- validar datos con TablePlus,
- probar endpoints con Postman,
- ejecutar el backlog funcional pendiente,
- reportar evidencia correcta en cada ticket.

Este documento no cubre deploy ni ambientes cloud.

## 1. Objetivo del equipo

El alcance del equipo es 100% local.

- No configurar Render.
- No configurar Vercel.
- No tocar pipelines de despliegue.
- Todo ticket debe desarrollarse, probarse y demostrarse en local.

## 2. Stack y puertos locales

- Frontend React + Vite: http://localhost:5173
- Backend NestJS: http://localhost:3002/api
- Health backend: http://localhost:3002/api/health
- PostgreSQL en Docker: localhost:5434

## 3. Software que debe instalar cada integrante

Instalacion obligatoria:

1. Git
2. Node.js 20 LTS
3. npm 10+ (viene con Node)
4. Docker Desktop
5. TablePlus o DBeaver (preferido TablePlus)
6. Postman
7. VS Code

Verificaciones rapidas en terminal:

    git --version
    node --version
    npm --version
    docker --version
    docker compose version

Si usan yarn:

    yarn --version

## 4. Clonar proyecto y preparar dependencias

Desde terminal:

    git clone <url-del-repo>
    cd Pro-Connect
    npm run setup:local

Que hace setup:local:

- instala backend en pro-connect/backend
- instala frontend en pro-connect/frontend

## 5. Variables de entorno

Crear los archivos .env desde los ejemplos:

1. Copiar pro-connect/backend/.env.example a pro-connect/backend/.env
2. Copiar pro-connect/frontend/.env.example a pro-connect/frontend/.env

Valores esperados para trabajo local:

Backend:

    NODE_ENV=development
    PORT=3002
    FRONTEND_URL=http://localhost:5173
    DB_SSL=false
    DB_HOST=localhost
    DB_PORT=5434
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_NAME=proconnect
    DB_SYNCHRONIZE=true
    DB_LOGGING=false

Frontend:

    VITE_API_URL=http://localhost:3002/api

## 6. Levantar base de datos local

Desde la raiz del repo:

    npm run db:up

Para validar contenedor activo:

    docker ps

Para apagar base:

    npm run db:down

## 7. Arrancar proyecto completo

Desde la raiz:

    yarn start:dev

Esto levanta backend y frontend juntos.

Checklist de arranque correcto:

- http://localhost:5173 abre la app
- http://localhost:3002/api/health responde status ok
- no hay errores fatales en consola de backend o frontend

## 8. Uso de TablePlus para revisar la base local

Crear nueva conexion PostgreSQL con estos datos:

- Name: ProConnect Local
- Host: localhost
- Port: 5434
- User: postgres
- Password: postgres
- Database: proconnect
- SSL: Disabled

Pruebas recomendadas en TablePlus:

1. Confirmar tablas creadas:
   users, professional_profile, service, reservation, review, invoice, notification, availability_slot, chat_conversation, chat_message.
2. Ejecutar consultas de validacion de flujo.

Consulta para ver reservas recientes:

    select id, status, scheduled_at, proposed_price, counter_offer_price
    from reservation
    order by created_at desc
    limit 20;

Consulta para verificar facturas:

    select id, reservation_id, total, issued_at
    from invoice
    order by issued_at desc
    limit 20;

Consulta para notificaciones:

    select id, user_id, type, title, message, read_at, created_at
    from notification
    order by created_at desc
    limit 30;

## 9. Uso de Postman para probar la API

Crear un Environment en Postman llamado ProConnect Local:

- baseUrl = http://localhost:3002/api
- userId = vacio al inicio
- professionalUserId = vacio
- reservationId = vacio
- professionalId = vacio
- serviceId = vacio

Header que usa este proyecto actualmente:

- x-user-id: valor de userId o professionalUserId

### Coleccion minima recomendada

Auth:

1. POST {{baseUrl}}/auth/register (cliente)
2. POST {{baseUrl}}/auth/register (profesional)
3. POST {{baseUrl}}/auth/login
4. GET {{baseUrl}}/auth/me

Servicios y reservas:

1. POST {{baseUrl}}/services
2. POST {{baseUrl}}/reservations
3. PATCH {{baseUrl}}/reservations/:id/respond
4. PATCH {{baseUrl}}/reservations/:id/accept-counter
5. PATCH {{baseUrl}}/reservations/:id/reschedule
6. PATCH {{baseUrl}}/reservations/:id/cancel

Facturacion y reputacion:

1. POST {{baseUrl}}/invoices/generate/:reservationId
2. GET {{baseUrl}}/invoices
3. POST {{baseUrl}}/reviews
4. GET {{baseUrl}}/reputation/:professionalId

## 10. Plan de prueba manual end-to-end en local

Ejecutar este guion completo en cada entrega importante:

1. Registrar cliente y profesional.
2. Crear perfil profesional y servicio.
3. Cliente crea reserva con propuesta.
4. Profesional acepta o contraoferta.
5. Cliente acepta contraoferta si aplica.
6. Validar chat y notificaciones.
7. Generar factura (segun reglas vigentes).
8. Intentar reseña y validar reglas de estado.
9. Confirmar datos en TablePlus.
10. Repetir flujo negativo: usuario no autorizado.

## 10.1 Modulo de FACTURACION (obligatorio)

La facturacion es parte obligatoria del alcance funcional del equipo.

Que debe verificarse siempre:

1. Que se pueda generar factura cuando la reserva cumpla la regla de negocio definida.
2. Que no se permita facturar en estados no permitidos.
3. Que el total facturado coincida con el precio final aplicado a la reserva.
4. Que el historial de facturas se vea en UI y API.

Validaciones minimas de facturacion:

- UI: pantalla de facturas muestra registro nuevo con total y fecha.
- API: endpoints de facturacion responden correctamente.
- BD (TablePlus): tabla invoice refleja reservation_id y total esperados.

Endpoints de referencia para FACTURACION:

- POST /api/invoices/generate/:reservationId
- GET /api/invoices

## 11. Backlog de implementacion para el equipo

Prioridad P0 a P2 para ejecutar de forma incremental.

### P0 - Cierre de reserva en COMPLETED

Problema:
- No hay cierre operativo real del servicio, bloquea reseñas.

Implementar:

1. Endpoint PATCH /reservations/:reservationId/complete.
2. Regla de autorizacion para participantes de la reserva.
3. Boton de completar en vistas de detalle cliente y profesional.
4. Mensajeria y notificacion de cierre correcto.

Aceptacion:

- Una reserva CONFIRMED puede pasar a COMPLETED.
- Una reserva COMPLETED permite crear reseña.

Pruebas:

- Postman: flujo completo hasta review.
- TablePlus: status en reservation cambia a COMPLETED.

### P0 - Facturacion coherente

Problema:
- Se factura en estados que no representan trabajo finalizado.

Implementar:

1. Facturar solo si reservation.status = COMPLETED.
2. Calcular total con precio final (negociado si existe).
3. Alinear botones y mensajes en frontend.

Aceptacion:

- No factura en PENDING ni CONFIRMED.
- Monto coincide con reglas de negocio.

Pruebas:

- Postman: casos permitido/bloqueado.
- TablePlus: total de invoice consistente.

Nota para el equipo:

- Ningun ticket que impacte reservas se considera completo si no valida su impacto en facturacion.

### P1 - Recuperacion de contraseña segura

Problema:
- Riesgo de enumeracion y fuga de recoveryCode.

Implementar:

1. Mensaje uniforme en request de recuperacion.
2. No exponer recoveryCode en respuesta API.
3. Ajustar frontend a mensaje neutral.

Aceptacion:

- Misma respuesta exista o no el correo.
- No hay codigo en payload de respuesta.

Pruebas:

- Postman con correo existente y no existente.

### P1 - UX de disponibilidad real

Problema:
- Etiquetas o señales visuales sin verificacion real.

Implementar:

1. Quitar etiqueta fija Disponible_Ahora.
2. Mostrar disponibilidad basada en slots reales.
3. Pantalla de gestion de disponibilidad para profesional.

Aceptacion:

- No se muestra disponibilidad ficticia.
- Profesional puede crear y consultar slots.

Pruebas:

- Flujo UI + confirmacion en TablePlus.

### P2 - Notificaciones semanticas por evento

Problema:
- Mensajes de notificacion no reflejan accion real.

Implementar:

1. Mensaje especifico para aceptar, rechazar, contraoferta, reprogramar, completar y cancelar.

Aceptacion:

- Mensaje correcto segun transicion de estado.

Pruebas:

- Verificacion en UI y tabla notification.

### P2 - Pruebas e2e funcionales

Problema:
- Cobertura automatizada insuficiente.

Implementar:

1. Ajustar e2e base a rutas con prefijo /api.
2. Crear e2e de flujos criticos.

Aceptacion:

- Suite e2e estable en local.
- Detecta regresiones de negocio critico.

## 12. Definition of Done por ticket

Un ticket se considera terminado solo si:

1. Cumple criterios de aceptacion funcional.
2. Se probó en UI y por API (Postman).
3. Se verifico impacto en BD (TablePlus).
4. Incluye pruebas automatizadas nuevas o actualizadas.
5. PR incluye evidencia: capturas o video corto.
6. No rompe flujo existente.

## 13. Troubleshooting rapido

Si backend no conecta a BD:

1. Revisar Docker Desktop levantado.
2. Ejecutar docker ps.
3. Confirmar puerto 5434 libre.
4. Revisar variables en pro-connect/backend/.env.

Si frontend no pega a backend:

1. Revisar VITE_API_URL en pro-connect/frontend/.env.
2. Confirmar backend en http://localhost:3002/api/health.
3. Reiniciar servidor frontend.

Si hay errores por dependencias:

    npm run setup:local

Si persiste:

    npm --prefix pro-connect/backend install
    npm --prefix pro-connect/frontend install

## 14. Comandos de uso diario

- Instalar todo: npm run setup:local
- Levantar BD: npm run db:up
- Apagar BD: npm run db:down
- Levantar frontend + backend: yarn start:dev
- Seed de datos: npm run seed

## 15. Regla final del equipo

Todo desarrollo y validacion se hace en local.
Si algo no puede demostrarse en local con UI + Postman + TablePlus, el ticket no se cierra.
