import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarUrl(avatarPath: string | null | undefined): string {
  return avatarPath || "/default-avatar.svg";
}
