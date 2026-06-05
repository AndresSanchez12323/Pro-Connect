# Practica Ansible + Playwright con GitHub Codespaces

Este flujo usa GitHub Codespaces como servidor remoto gratuito en la nube. No es una VPS permanente, pero sirve para demostrar la integracion:

- Ansible prepara el entorno remoto del Codespace.
- ProConnect corre en puertos publicos de Codespaces.
- Playwright prueba la app publicada con URLs `app.github.dev`.

## 1. Crear Codespace

En GitHub:

```text
Repositorio Pro-Connect
Code
Codespaces
Create codespace on main
```

El archivo `.devcontainer/devcontainer.json` instala Ansible, pnpm y Playwright automaticamente.

## 2. Configurar Neon

En la terminal del Codespace, exportar la cadena de Neon:

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST/proconnect?sslmode=require'
```

Si no quieren pegarla cada vez, crear un Codespaces Secret en GitHub llamado `DATABASE_URL`.

## 3. Hacer publicos los puertos

En la pestaña `Ports` del Codespace:

```text
3002 -> Port Visibility -> Public
4000 -> Port Visibility -> Public
```

## 4. Ejecutar Ansible

Desde la raiz del proyecto en Codespaces:

```bash
cd infra/codespaces/ansible
ansible-playbook -i inventory.ini playbook.yml
```

Esto crea:

- `pro-connect/backend/.env`
- `pro-connect/frontend/.env`
- datos seed para usuarios de prueba

## 5. Levantar ProConnect

Desde la raiz:

```bash
pnpm run start:dev
```

Codespaces mostrara URLs parecidas a:

```text
https://NOMBRE-CODESPACE-4000.app.github.dev
https://NOMBRE-CODESPACE-3002.app.github.dev
```

## 6. Ejecutar Playwright

Usar las URLs reales del panel `Ports`:

```bash
export E2E_BASE_URL='https://NOMBRE-CODESPACE-4000.app.github.dev'
export E2E_API_URL='https://NOMBRE-CODESPACE-3002.app.github.dev/api'

cd playwright-tests
npx playwright test
```

## 7. Ejecutar las pruebas individuales del parcial

Edwin:

```bash
cd playwright-tests
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

Brian:

```bash
cd playwright-tests
npx playwright test --config ../parcial-ansible-playwright/brian/playwright.config.ts
```

## Explicacion para el profesor

Usamos Codespaces como entorno remoto cloud. Ansible prepara variables, conexion a base de datos y datos de demostracion dentro del entorno remoto. Luego Playwright valida los flujos reales sobre la aplicacion expuesta mediante puertos publicos de Codespaces.

