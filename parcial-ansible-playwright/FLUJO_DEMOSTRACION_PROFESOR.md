# Flujo de demostracion: Ansible + Playwright

Esta guia esta pensada para la presentacion. La base de datos, las variables de entorno y el proyecto en Codespaces se dejan preparados antes. Frente al profesor solo se muestra que Ansible trabaja contra un servidor remoto y que Playwright valida la aplicacion web publicada.

## 1. Que se va a demostrar

La practica une estas dos partes:

```text
PC local -> Ansible -> SSH -> Codespace remoto -> crea evidencia JSON
PC local -> Playwright -> URL publica -> prueba ProConnect usando esa evidencia
```

Explicacion corta:

```text
Ansible automatiza una tarea en un servidor remoto. Playwright toma el resultado de esa tarea y prueba que la pagina web funcione con ese flujo.
```

## 2. Terminales

Usa nombres claros durante la exposicion:

| Terminal | Lugar | Para que se usa |
| --- | --- | --- |
| Terminal A | VS Code local / PowerShell | Probar que existe SSH hacia el Codespace. |
| Terminal B | VS Code online / Codespace | Mantener la aplicacion ProConnect corriendo. |
| Terminal C | VS Code local / WSL Ubuntu | Ejecutar Ansible y Playwright. |

## 3. Datos del servidor remoto

Codespace remoto:

```text
psychic-yodel-7v7pwxpj7gx93pj9w
```

Frontend publico:

```text
https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev
```

Backend publico:

```text
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api
```

Healthcheck:

```text
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api/health
```

Puertos que deben estar publicos en Codespaces:

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

## 4. Preparacion previa, antes de la clase

Esto se hace antes de presentar. No hace falta mostrarlo completo al profesor.

### Terminal B: Codespace

Entrar al Codespace desde GitHub o desde VS Code online y ejecutar:

```bash
cd /workspaces/Pro-Connect
git pull origin main
```

Configurar la URL de Neon solo en la terminal, sin guardarla en Git:

```bash
export DATABASE_URL='postgresql://USUARIO:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require'
```

Preparar `.env`, dependencias y datos iniciales:

```bash
cd /workspaces/Pro-Connect/infra/codespaces/ansible
ansible-playbook -i inventory.ini playbook.yml
```

Levantar backend y frontend:

```bash
cd /workspaces/Pro-Connect
pnpm run start:dev
```

Dejar esa terminal abierta.

### Terminal A: PowerShell local

Confirmar que los puertos estan publicos:

```powershell
gh codespace ports -c psychic-yodel-7v7pwxpj7gx93pj9w
```

Si alguno aparece privado:

```powershell
gh codespace ports visibility 3002:public 4000:public -c psychic-yodel-7v7pwxpj7gx93pj9w
```

### Prueba rapida

Abrir el healthcheck:

```text
https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api/health
```

Debe responder `status: ok`.

## 5. Inicio de la demostracion

Desde aqui empieza lo que se muestra al profesor.

### Terminal A: demostrar SSH al servidor remoto

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w
```

Dentro del servidor remoto:

```bash
pwd
hostname
exit
```

Que decir:

```text
Aqui se evidencia que no estamos usando localhost como servidor objetivo. El PC local entra por SSH a un Codespace remoto.
```

### Terminal C: probar Ansible contra el remoto

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect"
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping
```

Resultado esperado:

```text
proconnect-codespace | SUCCESS
ping: pong
```

Que decir:

```text
Este ping lo hace Ansible usando SSH. Si responde pong, el servidor remoto esta listo para recibir automatizaciones.
```

## 6. Flujo de Edwin: profesional crea servicio

Objetivo:

```text
Edwin representa al profesional. Ansible prepara los datos del servicio y Playwright comprueba que el profesional pueda publicarlo.
```

### 6.1 Ejecutar Ansible de Edwin

Terminal C:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/edwin"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Que hace:

```text
1. Entra al Codespace remoto por SSH.
2. Crea el archivo remoto /tmp/proconnect-parcial/edwin/edwin-service-plan.json.
3. Descarga ese JSON al PC local en artifacts/edwin-service-plan.json.
```

Mostrar evidencia:

```bash
cat artifacts/edwin-service-plan.json
```

### 6.2 Ejecutar Playwright de Edwin

Terminal C:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/playwright-tests"
export E2E_BASE_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev'
export E2E_API_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api'
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```

Que valida:

```text
1. Lee el JSON creado por Ansible.
2. Inicia sesion como profesional.
3. Crea/publica el servicio indicado por Ansible.
4. Verifica que el servicio aparezca en la interfaz.
```

Abrir reporte si quieres mostrar evidencia visual:

```bash
npx playwright show-report ../parcial-ansible-playwright/edwin/playwright-report
```

## 7. Flujo de Brian: cliente contrata servicio

Objetivo:

```text
Brian representa al usuario cliente. Ansible prepara el criterio de compra y Playwright comprueba que el cliente pueda ver ofertas y contratar una.
```

### 7.1 Ejecutar Ansible de Brian

Terminal C:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/parcial-ansible-playwright/brian"
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Que hace:

```text
1. Entra al Codespace remoto por SSH.
2. Crea el archivo remoto /tmp/proconnect-parcial/brian/brian-hiring-plan.json.
3. Descarga ese JSON al PC local en artifacts/brian-hiring-plan.json.
```

Mostrar evidencia:

```bash
cat artifacts/brian-hiring-plan.json
```

### 7.2 Ejecutar Playwright de Brian

Terminal C:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect/playwright-tests"
export E2E_BASE_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-4000.app.github.dev'
export E2E_API_URL='https://psychic-yodel-7v7pwxpj7gx93pj9w-3002.app.github.dev/api'
npx playwright test --config ../parcial-ansible-playwright/brian/playwright.config.ts
```

Que valida:

```text
1. Lee el JSON creado por Ansible.
2. Inicia sesion como cliente.
3. Busca servicios disponibles.
4. Entra a una oferta y la contrata.
5. Verifica que la solicitud quede registrada.
```

Abrir reporte:

```bash
npx playwright show-report ../parcial-ansible-playwright/brian/playwright-report
```

## 8. Comandos para reiniciar la practica

Estos comandos limpian solo la evidencia de Ansible y los reportes de Playwright. No borran la base de datos ni desmontan el Codespace.

Terminal C:

```bash
cd "/home/gury/nest/Proyecto Pro-Connect/Pro-Connect"
rm -rf parcial-ansible-playwright/edwin/playwright-report parcial-ansible-playwright/edwin/test-results
rm -rf parcial-ansible-playwright/brian/playwright-report parcial-ansible-playwright/brian/test-results
rm -f parcial-ansible-playwright/edwin/artifacts/edwin-service-plan.json
rm -f parcial-ansible-playwright/brian/artifacts/brian-hiring-plan.json
```

Luego se repite desde:

```text
6. Flujo de Edwin
7. Flujo de Brian
```

## 9. Que responder si preguntan por localhost

Respuesta corta:

```text
La aplicacion corre en GitHub Codespaces, que es un entorno remoto. Ansible no apunta a localhost; usa un inventario SSH que conecta desde mi PC local hacia el Codespace. Playwright tampoco prueba localhost, prueba las URLs publicas del Codespace.
```

## 10. Que responder si preguntan por modulos, servicios y controladores

En NestJS el backend esta organizado asi:

| Concepto | Donde verlo | Explicacion |
| --- | --- | --- |
| Modulo principal | `pro-connect/backend/src/app.module.ts` | Une la configuracion global, base de datos y modulos del sistema. |
| Modulos funcionales | `pro-connect/backend/src/modules/*/*.module.ts` | Agrupan una funcionalidad, por ejemplo autenticacion, usuarios, servicios y contrataciones. |
| Controladores | `pro-connect/backend/src/modules/*/*.controller.ts` | Reciben peticiones HTTP, por ejemplo login, crear servicio o contratar. |
| Servicios | `pro-connect/backend/src/modules/*/*.service.ts` | Contienen la logica de negocio y consultan la base de datos. |
| Entidades | `pro-connect/backend/src/modules/*/*.entity.ts` | Representan tablas de PostgreSQL usando TypeORM. |
| Healthcheck | `pro-connect/backend/src/health.controller.ts` | Endpoint simple para comprobar que el backend esta vivo. |

Explicacion corta:

```text
El controlador expone la ruta HTTP, el servicio ejecuta la logica y el modulo conecta esas piezas dentro de NestJS.
```
