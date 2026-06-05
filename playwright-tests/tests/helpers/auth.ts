import type { APIRequestContext, Page } from '@playwright/test';

export type TestRole = 'USER' | 'PROFESSIONAL';

export interface LoginSession {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: TestRole;
  };
  profile: {
    id: string;
    userId: string;
    specialty: string;
  } | null;
}

function normalizeApiURL(value: string) {
  const withoutTrailingSlash = value.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

export const apiURL = normalizeApiURL(process.env.E2E_API_URL ?? 'http://localhost:3002/api');

export const credentials = {
  clientEmail: process.env.E2E_CLIENT_EMAIL ?? 'camila.user@proconnect.dev',
  professionalEmail: process.env.E2E_PRO_EMAIL ?? 'diego.pro@proconnect.dev',
  password: process.env.E2E_PASSWORD ?? 'ProConnect123!',
};

export async function loginByApi(request: APIRequestContext, email: string): Promise<LoginSession> {
  const response = await request.post(`${apiURL}/auth/login`, {
    data: {
      email,
      password: credentials.password,
    },
  });

  if (!response.ok()) {
    throw new Error(`No se pudo iniciar sesion para ${email}: ${response.status()} ${await response.text()}`);
  }

  return response.json() as Promise<LoginSession>;
}

export async function prepareSession(page: Page, session: LoginSession) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('proconnect.session', JSON.stringify(value));
  }, session);
}
