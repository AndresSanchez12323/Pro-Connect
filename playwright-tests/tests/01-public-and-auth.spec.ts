import { expect, test } from '@playwright/test';
import { credentials, loginByApi, prepareSession } from './helpers/auth';

test('la pagina publica carga y permite llegar al login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/ProConnect/i).first()).toBeVisible();

  await page.getByRole('link', { name: /iniciar|login|acceso/i }).first().click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('button', { name: /autenticar/i })).toBeVisible();
});

test('un cliente autenticado entra a su panel', async ({ page, request }) => {
  const session = await loginByApi(request, credentials.clientEmail);
  await prepareSession(page, session);

  await page.goto('/dashboard/client/overview');
  await expect(page.getByText(session.user.fullName)).toBeVisible();
  await expect(page.getByRole('link', { name: /explorar servicios/i })).toBeVisible();
});

test('un profesional autenticado entra a su panel', async ({ page, request }) => {
  const session = await loginByApi(request, credentials.professionalEmail);
  await prepareSession(page, session);

  await page.goto('/dashboard/professional/overview');
  await expect(page.getByText(session.user.fullName)).toBeVisible();
  await expect(page.getByRole('link', { name: /nuevo servicio/i })).toBeVisible();
});
