import { expect, test } from '../../../playwright-tests/node_modules/@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { apiURL, credentials, loginByApi, prepareSession } from '../../../playwright-tests/tests/helpers/auth';

interface BrianArtifact {
  student: string;
  role: string;
  flow: string;
  service: {
    title: string;
    description: string;
    price: number;
    deliveryDays: number;
  };
  hiring: {
    searchTerm: string;
    scheduledOffsetDays: number;
  };
}

const artifactPath = path.resolve(__dirname, '../artifacts/brian-hiring-plan.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as BrianArtifact;

function toDatetimeLocalValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
}

test('Brian encuentra una oferta preparada por Ansible y la contrata', async ({ page, request }) => {
  expect(artifact.student).toBe('Brian');
  expect(artifact.flow).toBe('client_hires_service');

  const professionalSession = await loginByApi(request, credentials.professionalEmail);
  let serviceId = '';

  await test.step('publicar oferta temporal desde los datos de Ansible', async () => {
    const response = await request.post(`${apiURL}/services`, {
      headers: {
        Authorization: `Bearer ${professionalSession.token}`,
      },
      data: artifact.service,
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

    await page.getByPlaceholder(/buscar por servicio/i).fill(artifact.hiring.searchTerm);
    await page.getByRole('button', { name: /^buscar$/i }).click();
    await expect(page.getByText(artifact.service.title)).toBeVisible();

    const serviceCard = page.locator('.minimal-card').filter({ hasText: artifact.service.title }).last();
    await serviceCard.getByRole('button', { name: /contratar/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/client\/checkout/);
    await expect(page.getByText(artifact.service.title)).toBeVisible();

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + artifact.hiring.scheduledOffsetDays);
    scheduledAt.setHours(10, 30, 0, 0);

    await page.locator('input[type="datetime-local"]').fill(toDatetimeLocalValue(scheduledAt));
    await page.getByRole('button', { name: /ejecutar contrato/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/client\/messages/);
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
