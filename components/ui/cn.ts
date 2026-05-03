// Tiny class-name helper. Wraps clsx so future swap (twMerge etc.) is one place.
import clsx, { type ClassValue } from "clsx";
export function cn(...args: ClassValue[]) {
  return clsx(args);
}
