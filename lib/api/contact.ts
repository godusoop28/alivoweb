import { apiFetch } from "./client";
import { ContactMessage } from "./types";

export async function submitContactMessage(input: { name: string; lastName?: string; email: string; message: string }) {
  return apiFetch<ContactMessage>("/contact", { method: "POST", body: input, token: null });
}
