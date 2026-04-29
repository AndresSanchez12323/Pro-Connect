# Patrones de diseno aplicados en PRO-CONNECT

Este documento resume los patrones usados en el proyecto y su ubicacion principal en el codigo.

## 1. Facade Pattern

Centraliza la logica de negocio del modulo en un solo punto de entrada para los casos de uso principales.

- Archivo principal: pro-connect/backend/src/pro-connect/pro-connect.facade.ts

## 2. Builder Pattern

Construye reservas por pasos para evitar objetos incompletos y encapsular diferencias de armado segun modalidad.

- Archivo principal: pro-connect/backend/src/pro-connect/patterns/reservation.builder.ts

## 3. Factory Pattern

Selecciona comportamiento por modalidad de servicio (por ejemplo, canal de notificacion y calculo de total de factura).

- Archivo principal: pro-connect/backend/src/pro-connect/patterns/reservation.factory.ts

## 4. Observer Pattern

Reacciona a eventos de dominio para ejecutar acciones desacopladas (por ejemplo, crear notificaciones cuando cambia una reserva o llega un mensaje).

- Archivo principal: pro-connect/backend/src/pro-connect/pro-connect.observer.ts

## 5. Event Bus

Publica y consume eventos de dominio para desacoplar emisores de receptores.

- Archivo principal: pro-connect/backend/src/pro-connect/domain-event-bus.service.ts

## 6. Repository Pattern (TypeORM)

Gestiona acceso a datos mediante repositorios por entidad, inyectados en servicios/fachadas.

- Uso principal: pro-connect/backend/src/pro-connect/pro-connect.facade.ts

## 7. Gateway Pattern (WebSocket)

Canal de comunicacion en tiempo real para mensajeria y eventos de chat.

- Archivo principal: pro-connect/backend/src/pro-connect/pro-connect.gateway.ts

## Mapa rapido por flujo

- Crear reserva: Facade + Builder + Factory + Event Bus.
- Actualizar/cancelar reserva: Facade + Event Bus + Observer.
- Chat: Facade + Gateway + Event Bus + Observer.
- Facturacion: Facade + Factory.
