import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Select } from "@/components/ui/select";
import { getMe, listMembers, setMemberRole } from "@/lib/fns/app";
import { label, ROLE_LABEL, t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import { ROLES, type Profile, type Role } from "@/lib/types";

export const Route = createFileRoute("/ops/admin")({ component: AdminPage });

function AdminPage() {
  const locale = useLocale((s) => s.locale);
  const [me, setMe] = useState<Profile | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);

  useEffect(() => {
    void getMe().then((r) => setMe(r.profile));
    void listMembers().then(setMembers);
  }, []);

  if (me && me.role !== "admin") {
    return <p className="text-sm text-muted">{t(locale, "noPermission")}</p>;
  }

  return (
    <div className="pb-16">
      <PageHeader kicker={t(locale, "staffOnly")} title={t(locale, "admin")} />
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">{t(locale, "name")}</th>
              <th className="px-4 py-3">{t(locale, "email")}</th>
              <th className="px-4 py-3">{t(locale, "role")}</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="px-4 py-3">{m.display_name}</td>
                <td className="px-4 py-3 text-muted">{m.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <Select
                    value={m.role}
                    onChange={(e) => {
                      const role = e.target.value as Role;
                      void setMemberRole({ data: { userId: m.id, role } })
                        .then(() => setMembers((rows) => rows.map((r) => (r.id === m.id ? { ...r, role } : r))))
                        .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {label(ROLE_LABEL, r, locale)}
                      </option>
                    ))}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
