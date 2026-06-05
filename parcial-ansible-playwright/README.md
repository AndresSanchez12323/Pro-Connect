# Parcial Ansible + Playwright

Esta carpeta separa la misma practica en dos entregas individuales:

- `edwin`: perspectiva del profesional. Ansible define el servicio que se va a publicar y Playwright valida que el profesional pueda crearlo en ProConnect.
- `brian`: perspectiva del cliente. Ansible define la oferta que se va a contratar y Playwright valida que el cliente pueda verla y generar la reserva.

La union entre ambas herramientas se hace por medio de archivos JSON generados por Ansible en un servidor remoto. En esta practica el servidor remoto gratuito es GitHub Codespaces, conectado por SSH desde el PC local con GitHub CLI. Luego Ansible descarga esos archivos a cada carpeta `artifacts/` usando `fetch`. Playwright lee esos JSON y usa sus datos para ejecutar el flujo real contra la aplicacion publicada por los puertos del Codespace.

## Requisitos

1. Tener el Codespace `psychic-yodel-7v7pwxpj7gx93pj9w` encendido.
2. Tener SSH funcionando desde PowerShell local:

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w
```

3. Tener los puertos del Codespace en publico:

```text
3002 -> Public
4000 -> Public
```

4. Exportar las URLs publicas antes de ejecutar Playwright:

```bash
export E2E_BASE_URL="https://TU-CODESPACE-4000.app.github.dev"
export E2E_API_URL="https://TU-CODESPACE-3002.app.github.dev/api"
```

La practica no usa `localhost` para representar el servidor del parcial: Ansible trabaja desde el PC local por SSH contra Codespaces y Playwright prueba la aplicacion remota publicada.

## Verificar conexion remota antes de presentar

Desde WSL local, en la raiz del proyecto:

```bash
chmod +x infra/codespaces-ssh/gh-codespace-proxy.sh
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m shell -a "cd /workspaces/Pro-Connect && pwd && node -v && pnpm -v"
```

## Edwin

Desde WSL local:

```bash
cd parcial-ansible-playwright/edwin
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

cd ../../playwright-tests
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

## Brian

Desde WSL local:

```bash
cd parcial-ansible-playwright/brian
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

cd ../../playwright-tests
npx playwright test --config ../parcial-ansible-playwright/brian/playwright.config.ts
```

## Que se muestra en la exposicion

- Inventario remoto: demuestra a que servidor se conecta Ansible.
- Playbook: demuestra las tareas ejecutadas en el servidor remoto.
- Carpeta `artifacts/`: demuestra que Ansible trajo la evidencia remota a la maquina de pruebas.
- Playwright: demuestra que la tarea preparada por Ansible se valida contra ProConnect desplegado remotamente.

## Guion corto para exponer

1. Mostrar `gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w` entrando al servidor remoto.
2. Mostrar `ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping`.
3. Ejecutar el playbook de Edwin y explicar que crea en remoto `/tmp/proconnect-parcial/edwin/edwin-service-plan.json`.
4. Mostrar que Ansible descarga ese JSON a `edwin/artifacts/`.
5. Ejecutar Playwright de Edwin contra la URL publica del Codespace.
6. Repetir con Brian: Ansible crea la oferta remota y Playwright valida que el cliente la contrata.
