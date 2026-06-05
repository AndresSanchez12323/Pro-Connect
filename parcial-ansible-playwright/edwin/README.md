# Edwin - Profesional crea un servicio

## Que representa Ansible

El playbook prepara la tarea individual de Edwin conectandose por SSH a un servidor remoto. En ese servidor define un servicio profesional de HTML/CSS que debe publicarse en ProConnect. Al ejecutarse, crea remotamente el archivo:

```text
/tmp/proconnect-parcial/edwin/edwin-service-plan.json
```

Despues lo descarga a:

```text
artifacts/edwin-service-plan.json
```

Ese archivo es la evidencia de lo que Ansible hizo en remoto y tambien es la entrada que consume Playwright.

## Que valida Playwright

La prueba abre ProConnect desplegado en una URL remota como profesional, entra al formulario de creacion de servicios, usa los datos generados por Ansible y comprueba que el servicio quede visible en el panel del profesional.
