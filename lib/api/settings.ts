import { apiFetch } from "./client";
import { Settings } from "./types";

export async function getSettings() {
  return apiFetch<{ settings: Settings }>("/settings", { token: null });
}

export async function updateSettings(input: Partial<Settings>) {
  return apiFetch<{ settings: Settings }>("/admin/settings", { method: "PATCH", body: input });
}
