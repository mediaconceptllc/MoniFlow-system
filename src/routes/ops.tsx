import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/ops")({
  component: OpsLayout,
});

function OpsLayout() {
  return (
    <AuthGate>
      <AppShell track="ops">
        <Outlet />
      </AppShell>
    </AuthGate>
  );
}
