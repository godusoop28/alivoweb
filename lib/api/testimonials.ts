import { apiFetch } from "./client";
import { HomeTestimonial } from "./types";

export async function getHomeTestimonials() {
  return apiFetch<{ testimonials: HomeTestimonial[] }>("/testimonials/home", { token: null });
}
