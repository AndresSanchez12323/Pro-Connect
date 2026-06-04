# Pruebas E2E con Playwright

Esta carpeta es independiente del frontend y del backend. No modifica `src`, no usa los tests de Nest y guarda sus reportes dentro de `playwright-tests/`.

## Preparacion

Desde esta carpeta:

```powershell
cd C:\Users\edwin_ib91qce\Desktop\ProConnect\Pro-Connect\playwright-tests
npm install
npm run install:browsers
```

Antes de correr las pruebas, levanta la base de datos y carga los datos de prueba:

```powershell
cd C:\Users\edwin_ib91qce\Desktop\ProConnect\Pro-Connect
docker compose -f pro-connect/docker-compose.yml up -d
pnpm run seed
```

Playwright reutiliza la app si ya esta abierta. Si no lo esta, intenta levantar frontend y backend con `pnpm run start:dev`.

## Ejecutar pruebas

En otra terminal:

```powershell
cd C:\Users\edwin_ib91qce\Desktop\ProConnect\Pro-Connect\playwright-tests
npm test
```

Para verlas en modo visual:

```powershell
npm run test:headed
```

Para abrir el reporte:

```powershell
npm run report
```

## Variables opcionales

Puedes cambiar las URLs o usuarios con variables de entorno:

```powershell
$env:E2E_BASE_URL="http://localhost:4000"
$env:E2E_API_URL="http://localhost:3002/api"
$env:E2E_CLIENT_EMAIL="camila.user@proconnect.dev"
$env:E2E_PRO_EMAIL="diego.pro@proconnect.dev"
$env:E2E_PASSWORD="ProConnect123!"
```

## Que validan

- Carga publica y acceso al login.
- Login de cliente y profesional usando usuarios del seed.
- La red de servicios muestra un servicio creado por profesional.
- Endpoints de reputacion y facturas existen y responden.

La prueba del feed crea un servicio temporal con prefijo `E2E` y lo elimina al finalizar.
