# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-public-and-auth.spec.ts >> un profesional autenticado entra a su panel
- Location: tests\01-public-and-auth.spec.ts:22:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /nuevo servicio/i })
Expected: visible
Error: strict mode violation: getByRole('link', { name: /nuevo servicio/i }) resolved to 2 elements:
    1) <a data-discover="true" href="/dashboard/professional/create-service" class="block text-sm px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10">Nuevo servicio</a> aka getByRole('link', { name: 'Nuevo servicio', exact: true })
    2) <a data-discover="true" href="/dashboard/professional/create-service" class="minimal-card p-5 flex items-center gap-3 hover:border-primary/40 transition-all">…</a> aka getByRole('link', { name: 'Crear nuevo servicio Publica' })

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByRole('link', { name: /nuevo servicio/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "ProConnect" [ref=e7] [cursor=pointer]:
        - /url: /dashboard/professional/overview
      - generic [ref=e8]:
        - link "Inicio" [ref=e9] [cursor=pointer]:
          - /url: /dashboard/professional/overview
          - img [ref=e11]
          - generic [ref=e14]: Inicio
        - link "Trabajos" [ref=e15] [cursor=pointer]:
          - /url: /dashboard/professional/network
          - img [ref=e17]
          - generic [ref=e20]: Trabajos
        - link "Servicios" [ref=e21] [cursor=pointer]:
          - /url: /dashboard/professional/services
          - img [ref=e23]
          - generic [ref=e26]: Servicios
        - link "Facturas" [ref=e27] [cursor=pointer]:
          - /url: /dashboard/professional/invoices
          - img [ref=e29]
          - generic [ref=e31]: Facturas
        - link "Mensajes" [ref=e32] [cursor=pointer]:
          - /url: /dashboard/professional/messages
          - img [ref=e34]
          - generic [ref=e36]: Mensajes
        - link "1 Notificaciones" [ref=e37] [cursor=pointer]:
          - /url: /dashboard/professional/notifications
          - generic [ref=e38]:
            - img [ref=e39]
            - generic [ref=e42]: "1"
          - generic [ref=e43]: Notificaciones
        - link "Ajustes" [ref=e44] [cursor=pointer]:
          - /url: /dashboard/professional/settings
          - img [ref=e46]
          - generic [ref=e49]: Ajustes
      - generic [ref=e50]:
        - generic [ref=e51]:
          - paragraph [ref=e52]: Diego Herrera
          - paragraph [ref=e53]: PROFESIONAL
        - button "Cerrar sesión" [ref=e54]:
          - img [ref=e55]
  - main [ref=e58]:
    - generic [ref=e59]:
      - complementary [ref=e61]:
        - generic [ref=e62]:
          - heading "Diego Herrera" [level=2] [ref=e63]
          - paragraph [ref=e64]: diego.pro@proconnect.dev
          - paragraph [ref=e65]: "Rol: PROFESIONAL"
        - generic [ref=e66]:
          - paragraph [ref=e67]: Accesos rápidos
          - generic [ref=e68]:
            - link "Servicios" [ref=e69] [cursor=pointer]:
              - /url: /dashboard/professional/services
            - link "Nuevo servicio" [ref=e70] [cursor=pointer]:
              - /url: /dashboard/professional/create-service
            - link "Trabajos" [ref=e71] [cursor=pointer]:
              - /url: /dashboard/professional/network
            - link "Facturas" [ref=e72] [cursor=pointer]:
              - /url: /dashboard/professional/invoices
      - generic [ref=e74]:
        - generic [ref=e75]:
          - heading "Panel profesional de Diego Herrera" [level=1] [ref=e76]
          - paragraph [ref=e77]: Gestiona servicios, trabajos y comunicación en módulos separados.
        - generic [ref=e78]:
          - link "Servicios 2" [ref=e79] [cursor=pointer]:
            - /url: /dashboard/professional/services
            - paragraph [ref=e80]: Servicios
            - paragraph [ref=e81]: "2"
          - link "Trabajos activos 1" [ref=e82] [cursor=pointer]:
            - /url: /dashboard/professional/network
            - paragraph [ref=e83]: Trabajos activos
            - paragraph [ref=e84]: "1"
          - link "No leídas 1" [ref=e85] [cursor=pointer]:
            - /url: /dashboard/professional/notifications
            - paragraph [ref=e86]: No leídas
            - paragraph [ref=e87]: "1"
          - generic [ref=e88]:
            - paragraph [ref=e89]: Ingreso estimado
            - paragraph [ref=e90]: $240,000
        - generic [ref=e91]:
          - link "Crear nuevo servicio Publica una oferta con precio y modalidad" [ref=e92] [cursor=pointer]:
            - /url: /dashboard/professional/create-service
            - img [ref=e93]
            - generic [ref=e94]:
              - paragraph [ref=e95]: Crear nuevo servicio
              - paragraph [ref=e96]: Publica una oferta con precio y modalidad
          - link "Configurar perfil Actualiza tus datos visibles en la plataforma" [ref=e97] [cursor=pointer]:
            - /url: /dashboard/professional/settings
            - img [ref=e98]
            - generic [ref=e99]:
              - paragraph [ref=e100]: Configurar perfil
              - paragraph [ref=e101]: Actualiza tus datos visibles en la plataforma
        - generic [ref=e102]:
          - generic [ref=e103]:
            - heading "Últimos trabajos" [level=2] [ref=e104]:
              - img [ref=e105]
              - text: Últimos trabajos
            - link "Ver todos" [ref=e107] [cursor=pointer]:
              - /url: /dashboard/professional/network
          - 'link "Landing page HTML/CSS Camila Ruiz • 6/4/2026, 11:52:20 AM Estado: ACCEPTED" [ref=e109] [cursor=pointer]':
            - /url: /dashboard/professional/network/c4b83c97-08a6-4762-8508-cc5029fd90f2
            - paragraph [ref=e110]: Landing page HTML/CSS
            - paragraph [ref=e111]: Camila Ruiz • 6/4/2026, 11:52:20 AM
            - generic [ref=e112]: "Estado: ACCEPTED"
        - generic [ref=e113]:
          - generic [ref=e114]:
            - img [ref=e115]
            - text: "Recordatorio: revisa tus mensajes antes de cada sesión."
          - link "Ir a mensajes" [ref=e118] [cursor=pointer]:
            - /url: /dashboard/professional/messages
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | import { credentials, loginByApi, prepareSession } from './helpers/auth';
  3  | 
  4  | test('la pagina publica carga y permite llegar al login', async ({ page }) => {
  5  |   await page.goto('/');
  6  |   await expect(page.getByText(/ProConnect/i).first()).toBeVisible();
  7  | 
  8  |   await page.getByRole('link', { name: /iniciar|login|acceso/i }).first().click();
  9  |   await expect(page).toHaveURL(/\/login/);
  10 |   await expect(page.getByRole('button', { name: /autenticar/i })).toBeVisible();
  11 | });
  12 | 
  13 | test('un cliente autenticado entra a su panel', async ({ page, request }) => {
  14 |   const session = await loginByApi(request, credentials.clientEmail);
  15 |   await prepareSession(page, session);
  16 | 
  17 |   await page.goto('/dashboard/client/overview');
  18 |   await expect(page.getByRole('heading', { name: `Hola, ${session.user.fullName}` })).toBeVisible();
  19 |   await expect(page.getByRole('link', { name: /explorar servicios/i })).toBeVisible();
  20 | });
  21 | 
  22 | test('un profesional autenticado entra a su panel', async ({ page, request }) => {
  23 |   const session = await loginByApi(request, credentials.professionalEmail);
  24 |   await prepareSession(page, session);
  25 | 
  26 |   await page.goto('/dashboard/professional/overview');
  27 |   await expect(page.getByRole('heading', { name: `Panel profesional de ${session.user.fullName}` })).toBeVisible();
> 28 |   await expect(page.getByRole('link', { name: /nuevo servicio/i })).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
  29 | });
  30 | 
```