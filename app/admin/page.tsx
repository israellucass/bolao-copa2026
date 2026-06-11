import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { AppShell } from "@/components/AppShell";
import { getAdminData } from "@/lib/actions/admin";
import { requireCompleteUser } from "@/lib/auth";
import { theme } from "@/lib/theme";

export default async function AdminPage() {
  const user = await requireCompleteUser();
  if (!user.is_admin) redirect("/");

  const { matches, users, payments } = await getAdminData();

  return (
    <AppShell user={user}>
      <main className={theme.mainWithNav}>
        <section className="mb-5">
          <h1 className={theme.heading}>Painel Admin</h1>
          <p className={theme.subheading}>
            Gerencie partidas, pagamentos e resultados.
          </p>
        </section>
        <AdminPanel matches={matches} users={users} payments={payments} />
      </main>
    </AppShell>
  );
}
