# Deploy remoto de ProConnect con Ansible

Este playbook monta el proyecto completo en una VM Ubuntu remota para que la practica de Ansible + Playwright use una pagina web real, no `localhost`.

## Que instala

- Node.js 20
- pnpm 10.24.0
- Nginx
- PM2
- Frontend React compilado y servido por Nginx
- Backend NestJS corriendo con PM2
- Proxy `/api` y `/socket.io` hacia el backend
- Conexion a Neon usando `DATABASE_URL`

## 1. Crear servidor

Usar una VM Ubuntu 22.04 o 24.04 en DigitalOcean, AWS EC2, Azure, Google Cloud o similar.

Requisitos:

- IP publica.
- Puerto 22 abierto para SSH.
- Puerto 80 abierto para HTTP.
- Usuario SSH con sudo, normalmente `ubuntu`.

## 2. Configurar inventario

```bash
cd infra/ansible
ansible-galaxy collection install -r requirements.yml
cp inventory.example.ini inventory.ini
```

Editar `inventory.ini`:

```ini
[proconnect]
proconnect-vm ansible_host=IP_DEL_SERVIDOR ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/TU_LLAVE
```

## 3. Ejecutar deploy

Desde la raiz del proyecto:

```bash
cd infra/ansible
ansible-playbook -i inventory.ini playbook.yml \
  --extra-vars 'database_url=postgresql://USER:PASSWORD@HOST/proconnect?sslmode=require public_base_url=http://IP_DEL_SERVIDOR run_seed=true'
```

Usar `run_seed=true` solo cuando quieran cargar los usuarios de demostracion. Si ya tienen datos, usar `run_seed=false`.

## 4. Probar con Playwright

```bash
export E2E_BASE_URL="http://IP_DEL_SERVIDOR"
export E2E_API_URL="http://IP_DEL_SERVIDOR/api"

cd ../../playwright-tests
npx playwright test
```

## 5. Usarlo con las practicas de Edwin y Brian

Primero ejecutar este deploy completo. Luego ejecutar los playbooks individuales del parcial apuntando al mismo servidor remoto y correr sus pruebas:

```bash
export E2E_BASE_URL="http://IP_DEL_SERVIDOR"
export E2E_API_URL="http://IP_DEL_SERVIDOR/api"
```
