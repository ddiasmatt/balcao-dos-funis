import type { ReactNode } from "react";

import { Footer } from "./Footer";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  );
}
