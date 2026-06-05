# Deploy ProConnect con Vercel, Render y Neon

Esta es la arquitectura recomendada para el estado actual del proyecto:

- Frontend: Vercel, desde `pro-connect/frontend`.
- Backend: Render Web Service, usando `render.yaml` desde la raiz del repo.
- Base de datos: Neon PostgreSQL.

## 1. Neon

Crear una base PostgreSQL en Neon y copiar la cadena de conexion.

Usar la cadena con SSL:

```text
postgresql://USER:PASSWORD@HOST/proconnect?sslmode=require
```

## 2. Render

El backend se despliega con [render.yaml](../render.yaml).

Variables necesarias en Render:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST/proconnect?sslmode=require
DB_SSL=true
DB_SYNCHRONIZE=true
DB_LOGGING=false
FRONTEND_URL=https://tu-frontend.vercel.app
NODE_ENV=production
NODE_VERSION=20.19.0
```

Render debe exponer:

```text
https://tu-backend.onrender.com/api/health
```

Si ese endpoint responde `status: ok`, el backend esta vivo.

## 3. Vercel

Configurar el proyecto de Vercel apuntando a:

```text
pro-connect/frontend
```

Variable necesaria en Vercel:

```text
VITE_API_URL=https://tu-backend.onrender.com/api
```

El archivo [vercel.json](../pro-connect/frontend/vercel.json) ya configura el build y el rewrite para React Router.

## 4. Playwright contra produccion

Desde la raiz del proyecto:

```bash
export E2E_BASE_URL="https://tu-frontend.vercel.app"
export E2E_API_URL="https://tu-backend.onrender.com/api"
cd playwright-tests
npx playwright test
```

## 5. Ansible para el parcial

Con Vercel, Render y Neon ya se tiene una aplicacion web remota para Playwright.

Si el profesor exige Ansible por SSH, se necesita una VM remota adicional, por ejemplo AWS EC2, Azure VM, DigitalOcean o una maquina Linux publica. Render y Vercel no son ideales para esta parte porque normalmente no exponen SSH de administracion para ejecutar playbooks.

