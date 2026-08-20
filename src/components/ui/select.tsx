import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-sm border border-border bg-bg px-3 pr-8 text-sm text-fg outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/30",
        className,
      )}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9aa3' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "12px",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
