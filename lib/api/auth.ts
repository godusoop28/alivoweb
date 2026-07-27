import { apiFetch } from "./client";
import { AuthUser } from "./types";

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: { email, password },
    token: null,
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<{ token: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: { name, email, password },
    token: null,
  });
}

export async function getMe(token: string) {
  return apiFetch<{ user: AuthUser }>("/auth/me", { token });
}
