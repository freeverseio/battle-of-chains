import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString(undefined, {
    hour12: false,
    minute: "2-digit",
    hour: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
