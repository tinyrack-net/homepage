import { OWNER_NAME } from "@/lib/constants.ts";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-tinyrack-lg py-tinyrack-2xl text-center text-tinyrack-sm text-tinyrack-text-muted">
      © {year} by {OWNER_NAME}
    </footer>
  );
}
