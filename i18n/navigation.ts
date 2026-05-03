import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link / useRouter / usePathname / redirect helpers.
// Use these instead of next/link & next/navigation in app code so URLs
// stay correctly prefixed across locale changes.
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
