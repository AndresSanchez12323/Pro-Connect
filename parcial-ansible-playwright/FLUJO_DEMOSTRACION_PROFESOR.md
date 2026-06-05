# Flujo de demostracion para el profesor

Objetivo: demostrar que Ansible se conecta desde el PC local a un servidor remoto por SSH, prepara datos de prueba y luego Playwright valida la aplicacion web remota.

Servidor remoto usado:

```text
GitHub Codespaces
psychic-yodel-7v7pwxpj7gx93pj9w
```

## 1. Confirmar SSH remoto desde PowerShell local

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w
```

Dentro del Codespace:

```bash
pwd
hostname
exit
```

Mensaje para explicar:

```text
Aqui demostramos que el PC local se conecta por SSH al servidor remoto de GitHub Codespaces.
```

## 2. Confirmar Ansible remoto desde WSL local

Desde WSL local:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect"
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping
```

Resultado esperado:

```text
proconnect-codespace | SUCCESS
ping: pong
```

Luego:

```bash
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m shell -a "cd /workspaces/Pro-Connect && pwd && node -v && pnpm -v"
```

Mensaje para explicar:

```text
Aqui Ansible ya no esta actuando localmente: esta ejecutando comandos dentro del Codespace remoto usando SSH.
```

## 3. Levantar ProConnect en Codespaces

En la terminal del Codespace:

```bash
cd /workspaces/Pro-Connect
export DATABASE_URL='postgresql://USUARIO:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require'
cd infra/codespaces/ansible
ansible-playbook -i inventory.ini playbook.yml
cd ../../..
pnpm run start:dev
```

En la pestana `Ports`, poner:

```text
3002 -> Public
4000 -> Public
```

Copiar las URLs publicas:

```text
FRONTEND_URL=https://TU-CODESPACE-4000.app.github.dev
API_URL=https://TU-CODESPACE-3002.app.github.dev/api
```

Probar:

```text
https://TU-CODESPACE-3002.app.github.dev/api/health
```

## 4. Ejecutar practica de Edwin

Desde WSL local:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/edwin"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Mostrar evidencia local descargada por Ansible:

```bash
cat artifacts/edwin-service-plan.json
```

Luego ejecutar Playwright:

```bash
cd ../../playwright-tests
export E2E_BASE_URL='https://TU-CODESPACE-4000.app.github.dev'
export E2E_API_URL='https://TU-CODESPACE-3002.app.github.dev/api'
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

Mensaje para explicar:

```text
Edwin representa al profesional. Ansible crea en el servidor remoto la tarea del servicio a publicar, la descarga como JSON y Playwright valida que el profesional pueda crear ese servicio en la aplicacion.
```

## 5. Ejecutar practica de Brian

Desde WSL local:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/brian"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Mostrar evidencia local descargada por Ansible:

```bash
cat artifacts/brian-hiring-plan.json
```

Luego ejecutar Playwright:

```bash
cd ../../playwright-tests
export E2E_BASE_URL='https://TU-CODESPACE-4000.app.github.dev'
export E2E_API_URL='https://TU-CODESPACE-3002.app.github.dev/api'
npx playwright test --config ../parcial-ansible-playwright/brian/playwright.config.ts
```

Mensaje para explicar:

```text
Brian representa al cliente. Ansible crea en el servidor remoto la oferta a contratar, la descarga como JSON y Playwright valida que el cliente pueda encontrarla y contratarla.
```

## Cierre

```text
La practica integra tres elementos:
1. Servidor remoto: GitHub Codespaces.
2. Automatizacion: Ansible por SSH desde el PC local.
3. Validacion funcional: Playwright contra la aplicacion web remota.
```
