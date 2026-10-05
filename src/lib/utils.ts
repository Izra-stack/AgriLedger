import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findFarmerByInput<T extends { id: string; name: string; farmerCode?: string }>(
  farmers: T[],
  input: string
): T | undefined {
  if (!input) return undefined;
  const trimmed = input.trim().toLowerCase();
  return farmers.find(
    (f) =>
      f.name.toLowerCase() === trimmed ||
      f.id === input ||
      f.farmerCode?.toLowerCase() === trimmed
  );
}
