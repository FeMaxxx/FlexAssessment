import { format } from "date-fns";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(iso: string) {
  try {
    return format(new Date(iso), "dd.MM.yyyy");
  } catch {
    return iso;
  }
}
