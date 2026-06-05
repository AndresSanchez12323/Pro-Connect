# Guia de demostracion: Ansible + Playwright con Codespaces

Esta guia es para explicar la practica al profesor sin confundir que se ejecuta en el PC local y que se ejecuta en el servidor remoto.

## 1. Idea principal

La practica demuestra este flujo:

```text
PC local
  |
  | SSH usando GitHub CLI
  v
GitHub Codespaces remoto
  |
  | App ProConnect publicada por puertos publicos
  v
Playwright valida la pagina web remota
```

En palabras simples:

```text
Ansible se ejecuta desde el PC local, entra por SSH al Codespace remoto, crea un archivo JSON de evidencia y lo descarga.
Playwright se ejecuta desde el PC local, lee ese JSON y prueba la aplicacion publicada en Codespaces.
```

## 2. Que es cada cosa

| Elemento | Donde esta | Para que sirve |
| --- | --- | --- |
| PC local | Tu computador | Desde aqui ejecutas Ansible y Playwright. |
| WSL local | Ubuntu dentro de tu computador | Terminal donde corres `ansible-playbook` y `npx playwright test`. |
| PowerShell local | Windows de tu computador | Terminal donde pruebas SSH con `gh codespace ssh`. |
| GitHub Codespaces | Servidor remoto en la nube | Ahi corre ProConnect y ahi entra Ansible por SSH. |
| Neon | Base de datos remota | PostgreSQL usado por el backend. |
| Ansible | PC local hacia Codespaces | Automatiza tareas remotas y genera evidencia. |
| Playwright | PC local hacia URL publica | Valida el funcionamiento real de la aplicacion. |

## 3. Datos de esta practica

Servidor remoto:

```text
GitHub Codespaces
psychic-yodel-7v7pwxpj7gx93pj9w
```

URLs publicas del Codespace:

```text
Frontend:
https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev

Backend:
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api

Healthcheck:
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api/health
```

Puertos que deben estar publicos en la pestana `Ports` de Codespaces:

```text
3002 -> Public
4000 -> Public
```

Usuarios de prueba:

```text
Profesional:
diego.pro@proconnect.dev

Cliente:
camila.user@proconnect.dev

Password:
ProConnect123!
```

## 4. Terminales que se usan

Durante la exposicion conviene tener tres terminales claras.

### Terminal A: PowerShell local

Se usa para demostrar SSH directo desde Windows al Codespace.

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w
```

Dentro del Codespace remoto puedes mostrar:

```bash
pwd
hostname
exit
```

Explicacion para el profesor:

```text
Este comando demuestra que mi PC local puede entrar por SSH al servidor remoto de GitHub Codespaces.
```

### Terminal B: Codespace remoto

Se usa para levantar la aplicacion ProConnect.

Ruta del proyecto dentro del Codespace:

```bash
/workspaces/Pro-Connect
```

### Terminal C: WSL local

Se usa para ejecutar Ansible y Playwright desde tu PC local.

Ruta del proyecto en WSL:

```bash
/home/gury/nest/Proyecto Pro-Connect/Pro-Connect
```

## 5. Preparar la aplicacion en Codespaces

Estos comandos se ejecutan en la **Terminal B: Codespace remoto**.

```bash
cd /workspaces/Pro-Connect
git pull origin main
```

Configurar la base de datos de Neon:

```bash
export DATABASE_URL='postgresql://USUARIO:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require'
```

Ejecutar el playbook local del Codespace para crear `.env`, instalar dependencias y correr seed:

```bash
cd infra/codespaces/ansible
ansible-playbook -i inventory.ini playbook.yml
```

Volver a la raiz y levantar backend + frontend:

```bash
cd /workspaces/Pro-Connect
pnpm run start:dev
```

Despues de eso, confirmar en la pestana `Ports`:

```text
3002 -> Public
4000 -> Public
```

Probar en navegador:

```text
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api/health
```

Debe responder algo como:

```json
{
  "status": "ok",
  "service": "proconnect-backend"
}
```

Explicacion para el profesor:

```text
Aqui dejamos corriendo la aplicacion web en el servidor remoto. El backend queda en el puerto 3002 y el frontend en el 4000.
```

## 6. Demostrar que Ansible entra al servidor remoto

Estos comandos se ejecutan en la **Terminal C: WSL local**.

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect"
```

Probar conexion remota con Ansible:

```bash
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping
```

Resultado esperado:

```text
proconnect-codespace | SUCCESS
ping: pong
```

Ejecutar un comando dentro del Codespace remoto:

```bash
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m shell -a "cd /workspaces/Pro-Connect && pwd && node -v && pnpm -v"
```

Explicacion para el profesor:

```text
Este comando ya no se esta ejecutando localmente. Ansible esta entrando por SSH al Codespace remoto y ejecutando comandos dentro del servidor.
```

## 7. Practica de Edwin: profesional crea servicio

Objetivo de Edwin:

```text
Representar al profesional que publica un servicio.
```

### 7.1 Ejecutar Ansible de Edwin

Esto se ejecuta en la **Terminal C: WSL local**.

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/edwin"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Que hace Ansible:

```text
1. Entra por SSH al Codespace remoto.
2. Crea el archivo remoto:
   /tmp/proconnect-parcial/edwin/edwin-service-plan.json
3. Descarga ese archivo al PC local:
   parcial-ansible-playwright/edwin/artifacts/edwin-service-plan.json
```

Mostrar evidencia:

```bash
cat artifacts/edwin-service-plan.json
```

Explicacion para el profesor:

```text
Este JSON fue creado en el servidor remoto por Ansible y luego descargado al PC local. Playwright lo usa como datos de entrada para la prueba.
```

### 7.2 Ejecutar Playwright de Edwin

Esto se ejecuta en la **Terminal C: WSL local**.

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/playwright-tests"

export E2E_BASE_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev'
export E2E_API_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api'

npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

Que valida Playwright:

```text
1. Inicia sesion como profesional.
2. Entra a crear servicio.
3. Usa los datos del JSON generado por Ansible.
4. Publica el servicio.
5. Verifica que el servicio aparezca en el panel profesional.
```

## 8. Practica de Brian: cliente contrata oferta

Objetivo de Brian:

```text
Representar al cliente que busca una oferta y la contrata.
```

### 8.1 Ejecutar Ansible de Brian

Esto se ejecuta en la **Terminal C: WSL local**.

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/brian"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Que hace Ansible:

```text
1. Entra por SSH al Codespace remoto.
2. Crea el archivo remoto:
   /tmp/proconnect-parcial/brian/brian-hiring-plan.json
3. Descarga ese archivo al PC local:
   parcial-ansible-playwright/brian/artifacts/brian-hiring-plan.json
```

Mostrar evidencia:

```bash
cat artifacts/brian-hiring-plan.json
```

Explicacion para el profesor:

```text
Este JSON representa la oferta preparada para Brian desde el servidor remoto. Luego Playwright lo usa para validar el flujo del cliente.
```

### 8.2 Ejecutar Playwright de Brian

Esto se ejecuta en la **Terminal C: WSL local**.

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/playwright-tests"

export E2E_BASE_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev'
export E2E_API_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api'

npx playwright test --config ../parcial-ansible-playwright/brian/playwright.config.ts
```

Que valida Playwright:

```text
1. Crea una oferta temporal usando los datos del JSON de Ansible.
2. Inicia sesion como cliente.
3. Busca la oferta.
4. Abre el checkout.
5. Selecciona fecha.
6. Ejecuta la contratacion.
```

## 9. Que archivos mostrar en la exposicion

Mostrar estos archivos en este orden:

```text
1. infra/codespaces-ssh/inventory.ini
   Muestra como Ansible se conecta al Codespace remoto.

2. parcial-ansible-playwright/edwin/ansible/playbook.yml
   Muestra las tareas remotas de Edwin.

3. parcial-ansible-playwright/edwin/artifacts/edwin-service-plan.json
   Muestra la evidencia descargada por Ansible.

4. parcial-ansible-playwright/edwin/playwright/edwin-profesional-crea-servicio.spec.ts
   Muestra la prueba funcional de Playwright.

5. parcial-ansible-playwright/brian/ansible/playbook.yml
   Muestra las tareas remotas de Brian.

6. parcial-ansible-playwright/brian/artifacts/brian-hiring-plan.json
   Muestra la evidencia descargada por Ansible.

7. parcial-ansible-playwright/brian/playwright/brian-cliente-contrata-servicio.spec.ts
   Muestra la prueba funcional de Playwright.
```

## 10. Resumen para decirle al profesor

Puedes decir esto:

```text
La practica usa GitHub Codespaces como servidor remoto gratuito.
Desde mi PC local ejecuto Ansible.
Ansible se conecta por SSH al Codespace usando GitHub CLI.
En el Codespace, Ansible crea archivos JSON de evidencia para cada estudiante.
Luego esos archivos se descargan al PC local.
Playwright lee esos JSON y valida flujos reales en la aplicacion publicada por los puertos publicos del Codespace.
Edwin prueba el flujo del profesional que crea un servicio.
Brian prueba el flujo del cliente que contrata una oferta.
```

## 11. Errores comunes

### Error 401 en Playwright

Si aparece:

```text
No se pudo iniciar sesion ... 401
```

Revisar:

```text
1. El puerto 3002 debe estar Public.
2. E2E_API_URL debe terminar en /api.
3. El seed debe haberse ejecutado en Codespaces.
```

Comando correcto:

```bash
export E2E_API_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api'
```

### Pantalla de advertencia de GitHub

Si aparece:

```text
You are about to access a development port
```

Playwright ya presiona `Continue` automaticamente. Si aparece en navegador normal, presionar `Continue` una sola vez.

### El Codespace se apago

Si el Codespace se suspende, los archivos siguen ahi, pero los procesos se apagan.

Volver a levantar:

```bash
cd /workspaces/Pro-Connect
pnpm run start:dev
```

