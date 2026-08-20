import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  return (
    <AuthGate>
      <AppShell track="portal">
        <Outlet />
      </AppShell>
    </AuthGate>
  );
}
