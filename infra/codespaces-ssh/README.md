# Ansible desde PC local hacia GitHub Codespaces por SSH

Este inventario usa GitHub CLI como puente SSH hacia el Codespace remoto.

Codespace actual:

```text
psychic-yodel-7v7pwxpj7gx93pj9w
```

## 1. Probar SSH desde PowerShell local

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w
```

Si entra al prompt remoto, salir con:

```bash
exit
```

## 2. Probar Ansible desde WSL local

Desde la raiz del proyecto en WSL:

```bash
mkdir -p ~/.ssh
cp /mnt/c/Users/edwin_ib91qce/.ssh/codespaces.auto ~/.ssh/codespaces.auto
cp /mnt/c/Users/edwin_ib91qce/.ssh/codespaces.auto.pub ~/.ssh/codespaces.auto.pub
chmod 600 ~/.ssh/codespaces.auto
chmod 644 ~/.ssh/codespaces.auto.pub
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m ping
```

Resultado esperado:

```text
proconnect-codespace | SUCCESS
```

## 3. Ejecutar comando remoto de demostracion

```bash
ansible -i infra/codespaces-ssh/inventory.ini codespace_remote -m shell -a "cd /workspaces/Pro-Connect && pwd && node -v && pnpm -v"
```

Si necesitan regenerar la configuracion SSH, desde PowerShell local:

```powershell
gh codespace ssh -c psychic-yodel-7v7pwxpj7gx93pj9w --config
```

La salida se adapto para WSL en:

```text
infra/codespaces-ssh/ssh_config
```

Si se crea otro Codespace, cambiar `psychic-yodel-7v7pwxpj7gx93pj9w` por el nuevo nombre en:

```text
infra/codespaces-ssh/ssh_config
infra/codespaces-ssh/inventory.ini
parcial-ansible-playwright/edwin/ansible/inventory.ini
parcial-ansible-playwright/brian/ansible/inventory.ini
```

Esto demuestra:

```text
PC local -> Ansible -> SSH -> GitHub Codespace remoto
```
