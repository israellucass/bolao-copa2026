import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfileForm } from "@/components/ProfileForm";
import { getSessionUser } from "@/lib/auth";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <AppShell user={user}>
      <ProfileForm defaultName={user.name ?? ""} />
    </AppShell>
  );
}
