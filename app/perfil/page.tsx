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

  const needsProfile = userNeedsProfile(user);
  const { step } = await searchParams;
  const pixStep = !needsProfile && step === "pix" ? "pix" : undefined;

  return (
    <AppShell user={user}>
      <ProfileForm
        defaultName={user.name ?? ""}
        defaultPixKey={user.pix_key ?? ""}
        needsProfile={needsProfile}
        step={pixStep}
      />
    </AppShell>
  );
}
