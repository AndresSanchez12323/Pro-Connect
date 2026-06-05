# Parcial Ansible + Playwright

Esta carpeta separa la misma practica en dos entregas individuales:

- `edwin`: perspectiva del profesional. Ansible define el servicio que se va a publicar y Playwright valida que el profesional pueda crearlo en ProConnect.
- `brian`: perspectiva del cliente. Ansible define la oferta que se va a contratar y Playwright valida que el cliente pueda verla y generar la reserva.

La union entre ambas herramientas se hace por medio de archivos JSON generados por Ansible en un servidor remoto. Luego Ansible descarga esos archivos a cada carpeta `artifacts/` usando `fetch`. Playwright lee esos JSON y usa sus datos para ejecutar el flujo real contra la aplicacion desplegada en remoto.

## Requisitos

1. Tener un servidor remoto accesible por SSH, por ejemplo una VM de AWS, Azure, Google Cloud, Render SSH, DigitalOcean o una maquina Linux publica.
2. Tener ProConnect desplegado en ese servidor remoto o en una URL remota accesible desde la maquina donde se ejecuta Playwright.
3. Editar los inventarios:

```text
parcial-ansible-playwright/edwin/ansible/inventory.ini
parcial-ansible-playwright/brian/ansible/inventory.ini
```

Reemplazar:

```text
TU_IP_O_DOMINIO_REMOTO
TU_USUARIO_SSH
~/.ssh/TU_LLAVE_PRIVADA
```

4. Exportar las URLs remotas antes de ejecutar Playwright:

```bash
export E2E_BASE_URL="https://tu-frontend-remoto.com"
export E2E_API_URL="https://tu-backend-remoto.com/api"
```

La practica no usa `localhost` para representar el servidor del parcial: Ansible trabaja por SSH contra el host remoto y Playwright prueba la aplicacion remota.

## Edwin

```bash
cd parcial-ansible-playwright/edwin
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

cd ../../playwright-tests
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

## Brian

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
