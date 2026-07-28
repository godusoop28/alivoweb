import { apiFetch } from "./client";
import { LearningResource } from "./types";

export async function listResources() {
  return apiFetch<{ resources: LearningResource[] }>("/resources");
}
