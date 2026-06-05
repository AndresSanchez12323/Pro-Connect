# Edwin - Profesional crea un servicio

## Que representa Ansible

El playbook prepara la tarea individual de Edwin conectandose por SSH desde el PC local al Codespace remoto. En ese servidor define un servicio profesional de HTML/CSS que debe publicarse en ProConnect. Al ejecutarse, crea remotamente el archivo:

```text
/tmp/proconnect-parcial/edwin/edwin-service-plan.json
```

Despues lo descarga a:

```text
artifacts/edwin-service-plan.json
```

Ese archivo es la evidencia de lo que Ansible hizo en remoto y tambien es la entrada que consume Playwright.

## Que valida Playwright

La prueba abre ProConnect en la URL publica del Codespace como profesional, entra al formulario de creacion de servicios, usa los datos generados por Ansible y comprueba que el servicio quede visible en el panel del profesional.

## Comandos de demostracion Edwin

```bash
cd /home/gury/nest/Proyecto\ Pro-Connect/Pro-Connect/parcial-ansible-playwright/edwin
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

cd ../../playwright-tests
npx playwright test --config ../parcial-ansible-playwright/edwin/playwright.config.ts
```
