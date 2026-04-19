# Backend PRO-CONNECT

API construida con NestJS y TypeORM.

## Scripts

- npm run start:dev
- npm run build
- npm run start:prod
- npm run seed

## Variables de entorno

Configurar archivo .env con:

- PORT
- FRONTEND_URL
- DATABASE_URL
- DB_SSL
- DB_SYNCHRONIZE
- DB_LOGGING

Si DATABASE_URL no esta definido, se usan variables locales DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME.
