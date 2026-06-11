import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfileForm } from "@/components/ProfileForm";
import { getSessionUser, userNeedsProfile } from "@/lib/auth";

interface PerfilPageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function PerfilPage({ searchParams }: PerfilPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { step } = await searchParams;
  if (step === "pix" && userNeedsProfile(user)) {
    redirect("/perfil");
  }

  return (
    <AppShell user={user}>
      <ProfileForm
        defaultName={user.name ?? ""}
        defaultPixKey={user.pix_key ?? ""}
        step={step === "pix" ? "pix" : undefined}
      />
    </AppShell>
  );
}
