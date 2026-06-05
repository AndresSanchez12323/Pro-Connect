# Parcial Ansible + Playwright

Esta carpeta contiene las dos entregas individuales:

- `edwin`: flujo del profesional que crea un servicio.
- `brian`: flujo del cliente que busca y contrata una oferta.

Para la exposicion usa esta guia principal:

```text
parcial-ansible-playwright/FLUJO_DEMOSTRACION_PROFESOR.md
```

La idea general es:

```text
PC local -> Ansible por SSH -> GitHub Codespaces remoto -> Playwright contra URL publica
```

Archivos importantes:

```text
edwin/ansible/playbook.yml
edwin/artifacts/edwin-service-plan.json
edwin/playwright/edwin-profesional-crea-servicio.spec.ts

brian/ansible/playbook.yml
brian/artifacts/brian-hiring-plan.json
brian/playwright/brian-cliente-contrata-servicio.spec.ts
```
