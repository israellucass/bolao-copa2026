import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { Navbar } from "@/components/Navbar";
import { getAdminData } from "@/lib/actions/admin";
import { requireCompleteUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireCompleteUser();
  if (!user.is_admin) redirect("/");

  const { matches, users, payments } = await getAdminData();

  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        <section className="mb-5">
          <h1 className="text-xl font-black text-emerald-950">Painel Admin</h1>
          <p className="text-sm text-gray-500">
            Gerencie partidas, pagamentos e resultados.
          </p>
        </section>
        <AdminPanel matches={matches} users={users} payments={payments} />
      </main>
    </>
  );
}
