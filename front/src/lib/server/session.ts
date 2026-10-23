import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "../types";
import { apiFetch } from "./api";

export const SESSION_COOKIE = "na_session";
const MAX_AGE = 60 * 60 * 24 * 7; // igual que JWT_EXPIRES_IN de la API

/**
 * El JWT vive en una cookie httpOnly: el JavaScript del navegador nunca lo ve,
 * así un XSS no puede robar la sesión. Next actúa como BFF y agrega el token al hablar con la API.
 */
export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Usuario actual (memoizado por request). Devuelve null si no hay sesión o el token expiró. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getToken();
  if (!token) return null;
  try {
    return await apiFetch<User>("/users/me", { token });
  } catch {
    return null;
  }
});
