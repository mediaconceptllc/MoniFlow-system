import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ops/desk")({
  component: () => <Outlet />,
});
