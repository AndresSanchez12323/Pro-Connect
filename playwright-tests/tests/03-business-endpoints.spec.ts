import { expect, test } from '@playwright/test';
import { apiURL, credentials, loginByApi } from './helpers/auth';

test('reputacion responde con promedio y cantidad', async ({ request }) => {
  const professionalSession = await loginByApi(request, credentials.professionalEmail);
  expect(professionalSession.profile?.id).toBeTruthy();

  const response = await request.get(`${apiURL}/reputation/${professionalSession.profile?.id}`);

  expect(response.ok()).toBeTruthy();
  await expect(response).toHaveJSON({
    average: expect.any(Number),
    count: expect.any(Number),
  });
});

test('facturas requiere autenticacion y responde al usuario autenticado', async ({ request }) => {
  const clientSession = await loginByApi(request, credentials.clientEmail);

  const anonymous = await request.get(`${apiURL}/invoices`);
  expect(anonymous.status()).toBe(401);

  const authenticated = await request.get(`${apiURL}/invoices`, {
    headers: {
      Authorization: `Bearer ${clientSession.token}`,
    },
  });
  expect(authenticated.ok()).toBeTruthy();
  expect(Array.isArray(await authenticated.json())).toBeTruthy();
});
