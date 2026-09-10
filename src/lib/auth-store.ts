// ─────────────────────────────────────────────────────────────
// Auth Token & User Store — localStorage + in-memory cache
// ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "euphoria_auth_token";

/** Reads JWT token from localStorage */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Writes JWT token to localStorage */
export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // SSR or private browsing — ignore
  }
}

/** Removes JWT token from localStorage */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// In-memory user cache (avoids prop drilling; survives within a SPA session)
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  participantCategory: string | null;
  scholarNumber: string | null;
  enrollmentNumber: string | null;
  collegeName: string | null;
  course: string | null;
  year: string | null;
  city: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

let cachedUser: AuthUser | null = null;

export function getUser(): AuthUser | null {
  return cachedUser;
}

export function setUser(user: AuthUser): void {
  cachedUser = user;
}

export function clearUser(): void {
  cachedUser = null;
}
