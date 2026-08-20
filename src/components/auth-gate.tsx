import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-sm bg-surface-2" />
          <p className="text-sm">…</p>
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
