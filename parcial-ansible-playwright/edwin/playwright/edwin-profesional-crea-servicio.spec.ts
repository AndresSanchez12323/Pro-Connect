import { expect, test } from '../../../playwright-tests/node_modules/@playwright/test';
import type { Page } from '../../../playwright-tests/node_modules/@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { credentials, loginByApi, prepareSession } from '../../../playwright-tests/tests/helpers/auth';

interface EdwinArtifact {
  student: string;
  role: string;
  flow: string;
  service: {
    title: string;
    description: string;
    price: number;
    deliveryDays: number;
  };
}

const artifactPath = resolve(__dirname, '../artifacts/edwin-service-plan.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as EdwinArtifact;

async function continueThroughCodespacesWarning(page: Page) {
  const continueButton = page.getByRole('button', { name: /^continue$/i });
  if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueButton.click();
    await page.waitForLoadState('domcontentloaded');
  }
}

test('Edwin publica un servicio preparado por Ansible', async ({ page, request }) => {
  expect(artifact.student).toBe('Edwin');
  expect(artifact.flow).toBe('professional_creates_service');

  const session = await loginByApi(request, credentials.professionalEmail);
  await prepareSession(page, session);

  await page.goto('/dashboard/professional/create-service');
  await continueThroughCodespacesWarning(page);
  await expect(page.getByRole('heading', { name: /crear nuevo servicio/i })).toBeVisible();

  await page.locator('input[type="text"]').fill(artifact.service.title);
  await page.locator('textarea').fill(artifact.service.description);
  await page.locator('input[type="number"]').nth(0).fill(String(artifact.service.price));
  await page.locator('input[type="number"]').nth(1).fill(String(artifact.service.deliveryDays));
  await page.getByRole('button', { name: /publicar servicio/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/professional\/services/);
  await expect(page.getByText(artifact.service.title)).toBeVisible();
});
