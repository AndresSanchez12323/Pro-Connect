import { expect, test } from '@playwright/test';
import { apiURL, credentials, loginByApi, prepareSession } from './helpers/auth';

test('un servicio creado por profesional aparece en la red del cliente', async ({ page, request }) => {
  const professionalSession = await loginByApi(request, credentials.professionalEmail);
  const serviceTitle = `E2E Servicio visible ${Date.now()}`;
  let serviceId = '';

  await test.step('crear servicio como profesional por API', async () => {
    const response = await request.post(`${apiURL}/services`, {
      headers: {
        Authorization: `Bearer ${professionalSession.token}`,
      },
      data: {
        title: serviceTitle,
        description: 'Servicio temporal creado por Playwright para validar el feed.',
        price: 99000,
        deliveryDays: 2,
      },
    });

    expect(response.ok()).toBeTruthy();
    const service = await response.json();
    serviceId = service.id;
  });

  try {
    const clientSession = await loginByApi(request, credentials.clientEmail);
    await prepareSession(page, clientSession);

    await page.goto('/dashboard/client/network');
    await expect(page.getByRole('heading', { name: /red de servicios/i })).toBeVisible();
    await expect(page.getByText(serviceTitle)).toBeVisible();
    await expect(page.getByRole('button', { name: /contratar/i }).first()).toBeVisible();
  } finally {
    if (serviceId) {
      await request.delete(`${apiURL}/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${professionalSession.token}`,
        },
      });
    }
  }
});
