# Brian - Cliente contrata una oferta

## Que representa Ansible

El playbook prepara la tarea individual de Brian conectandose por SSH a un servidor remoto. En ese servidor define una oferta disponible que el cliente debe encontrar y contratar. Al ejecutarse, crea remotamente el archivo:

```text
/tmp/proconnect-parcial/brian/brian-hiring-plan.json
```

Despues lo descarga a:

```text
artifacts/brian-hiring-plan.json
```

Ese archivo explica la accion preparada por Ansible en remoto y entrega los datos que Playwright usara durante la prueba.

## Que valida Playwright

La prueba trabaja contra ProConnect desplegado en una URL remota. Crea una oferta temporal con los datos del artefacto, inicia sesion como cliente, busca el servicio, abre la pantalla de contratacion, selecciona fecha y confirma la reserva.
