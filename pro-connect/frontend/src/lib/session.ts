export type UserRole = 'USER' | 'PROFESSIONAL';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  birthDate?: string | null;
  nationalId?: string | null;
  phone?: string | null;
}

export interface SessionProfile {
  id: string;
  userId: string;
  specialty: string;
  experience: number;
}

export interface AppSession {
  user: SessionUser;
  profile: SessionProfile | null;
}

const SESSION_KEY = 'proconnect.session';

export function getSession(): AppSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: AppSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUserId(): string | null {
  return getSession()?.user.id ?? null;
}

export function isProfessional(): boolean {
  return getSession()?.user.role === 'PROFESSIONAL';
}
